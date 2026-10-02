import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type Item = { product_id: number; quantity: number }

export async function POST(req: Request) {
  // 1. Check who is logged in
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 })

  const { data: userData } = await supabase.auth.getUser(token)
  const user = userData.user
  if (!user || !user.email) {
    return NextResponse.json({ error: 'Please sign in.' }, { status: 401 })
  }

  const { fullName, address, items } = (await req.json()) as {
    fullName: string
    address: string
    items: Item[]
  }
  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 })
  }

  // 2. Get real prices from the database (never trust the browser)
  const { data: products } = await supabase
    .from('products')
    .select('id, price')
    .in('id', items.map((i) => i.product_id))

  let total = 0
  const lines = []
  for (const i of items) {
    const p = products?.find((x) => x.id === i.product_id)
    if (!p || !Number.isInteger(i.quantity) || i.quantity < 1) {
      return NextResponse.json({ error: 'Invalid cart.' }, { status: 400 })
    }
    total += Number(p.price) * i.quantity
    lines.push({ product_id: p.id, price: Number(p.price), quantity: i.quantity })
  }

  // 3. Save the order as pending
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      email: user.email,
      full_name: fullName,
      address,
      total,
      status: 'pending',
    })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { error: itemsError } = await supabase.from('order_items').insert(
    lines.map((l) => ({
      order_id: order.id,
      product_id: l.product_id,
      quantity: l.quantity,
      price: l.price,
    }))
  )
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 })

  // 4. Ask Paystack for a payment link (amount is in kobo: 1 naira = 100 kobo)
  const reference = `order-${order.id}-${Date.now()}`
  const origin = new URL(req.url).origin

  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: user.email,
      amount: Math.round(total * 100),
      currency: 'NGN',
      reference,
      callback_url: `${origin}/api/paystack/callback`,
      metadata: { order_id: order.id },
    }),
  })
  const paystack = await res.json()

  if (!res.ok || !paystack.status) {
    return NextResponse.json(
      { error: paystack.message || 'Could not start payment.' },
      { status: 500 }
    )
  }

  await supabase.from('orders').update({ paystack_reference: reference }).eq('id', order.id)

  return NextResponse.json({ orderId: order.id, url: paystack.data.authorization_url })
}