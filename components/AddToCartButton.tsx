'use client'
import { useState } from 'react'
import { addToCart } from '@/lib/cart'

export default function AddToCartButton({ productId }: { productId: number }) {
  const [added, setAdded] = useState(false)

  return (
    <button
      onClick={() => {
        addToCart(productId)
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
      }}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full"
    >
      {added ? 'Added!' : 'Add to Cart'}
    </button>
  )
}