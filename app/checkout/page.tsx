'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getCart, saveCart } from '@/lib/cart'
import LoginButton from '@/components/LoginButton'

export default function CheckoutPage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)
  const [fullName, setFullName] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
      setChecking(false)
    })
  }, [])

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const items = getCart()
    if (items.length === 0) {
      setError('Your cart is empty.')
      return
    }

    setSubmitting(true)
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fullName, address, items }),
    })
    const result = await res.json()
    setSubmitting(false)

    if (!res.ok) {
      setError(result.error || 'Something went wrong.')
      return
    }
    saveCart([])
    router.push(`/order-success/${result.orderId}`)
  }

  if (checking) return <main className="p-8">Loading...</main>

  if (!email) {
    return (
      <main className="p-8 max-w-xl">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="mb-4">Please sign in to place your order.</p>
        <LoginButton />
      </main>
    )
  }

  return (
    <main className="p-8 max-w-xl">
      <Link href="/cart" className="underline">← Back to cart</Link>
      <h1 className="text-3xl font-bold my-6">Checkout</h1>
      <p className="mb-4">Ordering as {email}</p>

      <form onSubmit={placeOrder} className="flex flex-col gap-4">
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full name"
          className="border rounded p-3 text-black"
        />
        <textarea
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Delivery address"
          className="border rounded p-3 text-black"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 text-white px-6 py-3 rounded disabled:opacity-50"
        >
          {submitting ? 'Placing order...' : 'Place order'}
        </button>
      </form>
    </main>
  )
}