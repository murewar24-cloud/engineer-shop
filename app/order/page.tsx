'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import LoginButton from '@/components/LoginButton'

type Order = {
  id: number
  total: number
  status: string
  created_at: string
  order_items: { quantity: number; price: number; products: { name: string } | null }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [signedIn, setSignedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        setLoading(false)
        return
      }
      setSignedIn(true)
      const { data } = await supabase
        .from('orders')
        .select('id, total, status, created_at, order_items(quantity, price, products(name))')
        .order('created_at', { ascending: false })
      setOrders((data as unknown as Order[]) ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <main className="max-w-3xl mx-auto px-4 py-10">Loading...</main>

  if (!signedIn) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="mb-6 text-slate-600">Sign in to see your orders.</p>
          <div className="flex justify-center"><LoginButton /></div>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-slate-600">
          No orders yet. <Link href="/" className="text-blue-700 underline">Start shopping</Link>
        </p>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <div className="flex justify-between mb-3">
              <div className="font-semibold">Order #{o.id}</div>
              <div className="text-sm text-slate-500">{new Date(o.created_at).toLocaleDateString()}</div>
            </div>
            {o.order_items.map((i, idx) => (
              <div key={idx} className="text-slate-700">
                {i.quantity} x {i.products?.name}
              </div>
            ))}
            <div className="flex justify-between mt-3 font-bold">
              <span>Total: ₦{Number(o.total).toFixed(2)}</span>
              <span className="text-sm font-normal text-slate-500 capitalize">{o.status}</span>
            </div>
          </div>
        ))
      )}
    </main>
  )
}