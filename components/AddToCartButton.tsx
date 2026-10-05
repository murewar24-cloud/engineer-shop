'use client'
import { useState } from 'react'
import { addToCart } from '@/lib/cart'

export default function AddToCartButton({ productId }: { productId: number }) {
  const [label, setLabel] = useState('Add to Cart')

  return (
    <button
      onClick={async () => {
        const ok = await addToCart(productId)
        setLabel(ok ? 'Added!' : 'Sign in first')
        setTimeout(() => setLabel('Add to Cart'), 1500)
      }}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full"
    >
      {label}
    </button>
  )
}