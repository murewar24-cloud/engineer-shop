'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCart } from '../lib/cart'
import LoginButton from './LoginButton'

export default function Navbar() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const update = () => setCount(getCart().reduce((s, i) => s + i.quantity, 0))
    update()
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 p-4">
        <Link href="/" className="text-xl font-bold whitespace-nowrap">⚙️ Engineer Shop</Link>
        <form action="/search" className="hidden md:block flex-1 max-w-xs">
          <input
            name="q"
            placeholder="Search tools..."
            className="w-full rounded-full px-4 py-2 text-sm text-black"
          />
        </form>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/orders" className="hover:underline">Orders</Link>
          <Link href="/cart" className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-full whitespace-nowrap">
            🛒 Cart ({count})
          </Link>
          <LoginButton />
        </div>
      </div>
    </header>
  )
}