import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import formData from 'form-data'
import Mailgun from 'mailgun.js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const mg = new Mailgun(formData).client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
})

const naira = (n: number) => '₦' + n.toLocaleString('en-NG')

export async function GET(req: Request) {
  const url = new URL(req.url)
  const reference = url.searchParams.get('reference') || url.searchParams.get('trxref')
  if (!reference) return NextResponse.redirect(new URL('/cart', url.origin))

  // 1. Ask Paystack if this payment really happened
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
  )
  const result = await res.json()

  // 2. Find the matching order
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('paystack_reference', reference)
    .single()
  if (!order) return NextResponse.redirect(new URL('/cart', url.origin))

  const paid =
    result?.data?.status === 'success' &&
    result.data.amount === Math.round(Number(order.total) * 100)

  if (!paid) {
    return NextResponse.redirect(new URL('/cart?payment=failed', url.origin))
  }

  // 3. Mark as paid (only the first time, so the email is sent once)
  const { data: updated } = await supabase
    .from('orders')
    .update({ status: 'paid' })
    .eq('id', order.id)
    .eq('status', 'pending')
    .select()

  if (updated && updated.length > 0) {
    const { data: items } = await supabase
      .from('order_items')
      .select('quantity, price, products(name)')
      .eq('order_id', order.id)

    const lines = (items ?? [])
      .map((i: any) => {
        const name = Array.isArray(i.products) ? i.products[0]?.name : i.products?.name
        return `${i.quantity} x ${name} - ${naira(Number(i.price) * i.quantity)}`
      })
      .join('\n')

    try {
      await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
        from: `Engineer Shop <postmaster@${process.env.MAILGUN_DOMAIN}>`,
        to: [order.email],
        subject: `Order #${order.id} confirmed`,
        text:
          `Thanks ${order.full_name}!\n\nWe received your payment for order #${order.id}.\n\n` +
          `${lines}\n\nTotal: ${naira(Number(order.total))}\n\nShipping to:\n${order.address}`,
      })
    } catch (e) {
      console.error('Email failed:', e)
    }
  }

  return NextResponse.redirect(new URL(`/order-success/${order.id}`, url.origin))
}