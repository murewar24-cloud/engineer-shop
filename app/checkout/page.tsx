'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getCart } from '@/lib/cart'
import LoginButton from '@/components/LoginButton'

export default function CheckoutPage() {
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

    if (!res.ok) {
      setSubmitting(false)
      setError(result.error || 'Something went wrong.')
      return
    }
    window.location.href = result.url
  }

  if (checking) return <main className="max-w-xl mx-auto px-4 py-10">Loading...</main>

  if (!email) {
    return (
      <main className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Checkout</h1>
          <p className="mb-6 text-slate-600">Please sign in to place your order.</p>
          <div className="flex justify-center">
            <LoginButton />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <Link href="/cart" className="text-blue-700 hover:underline">← Back to cart</Link>
      <div className="bg-white rounded-xl shadow-sm p-8 mt-6">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="mb-6 text-slate-600">Ordering as {email}</p>

        <form onSubmit={placeOrder} className="flex flex-col gap-4">
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            className="border border-slate-300 rounded-lg p-3 text-black"
          />
          <textarea
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Delivery address"
            rows={4}
            className="border border-slate-300 rounded-lg p-3 text-black"
          />
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full disabled:opacity-50"
          >
            {submitting ? 'Redirecting to payment...' : 'Pay now'}
          </button>
        </form>
      </div>
    </main>
  )
}