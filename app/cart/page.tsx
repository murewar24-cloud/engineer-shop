'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getCart, saveCart, CartItem } from '@/lib/cart'

type Product = { id: number; name: string; price: number }

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const items = getCart()
    setCart(items)
    if (items.length === 0) {
      setLoading(false)
      return
    }
    supabase
      .from('products')
      .select('id, name, price')
      .in('id', items.map((i) => i.product_id))
      .then(({ data }) => {
        setProducts((data as Product[]) || [])
        setLoading(false)
      })
  }, [])

  const update = (items: CartItem[]) => {
    setCart(items)
    saveCart(items)
  }

  const changeQty = (id: number, delta: number) => {
    update(
      cart
        .map((i) => (i.product_id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    )
  }

  const total = cart.reduce((sum, i) => {
    const p = products.find((x) => x.id === i.product_id)
    return sum + (p ? Number(p.price) * i.quantity : 0)
  }, 0)

  if (loading) return <main className="max-w-3xl mx-auto px-4 py-10">Loading...</main>

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/" className="text-blue-700 hover:underline">← Keep shopping</Link>
      <h1 className="text-3xl font-bold my-6">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-slate-600">Your cart is empty.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          {cart.map((i) => {
            const p = products.find((x) => x.id === i.product_id)
            if (!p) return null
            return (
              <div key={i.product_id} className="flex items-center justify-between border-b border-slate-100 py-4">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-blue-700 font-bold">₦{Number(p.price).toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => changeQty(i.product_id, -1)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200">-</button>
                  <span className="w-6 text-center">{i.quantity}</span>
                  <button onClick={() => changeQty(i.product_id, 1)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200">+</button>
                </div>
              </div>
            )
          })}
          <div className="flex items-center justify-between mt-6">
            <p className="text-2xl font-bold">Total: ₦{total.toFixed(2)}</p>
            <Link href="/checkout" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full">
              Go to checkout
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}