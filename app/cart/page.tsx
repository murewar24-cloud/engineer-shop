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

  if (loading) return <main className="p-8">Loading...</main>

  return (
    <main className="p-8 max-w-2xl">
      <Link href="/" className="underline">← Keep shopping</Link>
      <h1 className="text-3xl font-bold my-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((i) => {
            const p = products.find((x) => x.id === i.product_id)
            if (!p) return null
            return (
              <div key={i.product_id} className="flex items-center justify-between border-b py-3">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div>${Number(p.price).toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => changeQty(i.product_id, -1)} className="border px-3 rounded">-</button>
                  <span>{i.quantity}</span>
                  <button onClick={() => changeQty(i.product_id, 1)} className="border px-3 rounded">+</button>
                </div>
              </div>
            )
          })}
          <p className="text-2xl font-bold mt-6">Total: ${total.toFixed(2)}</p>
          <Link href="/checkout" className="inline-block mt-4 bg-green-600 text-white px-6 py-3 rounded">
            Go to checkout
          </Link>
        </>
      )}
    </main>
  )
}