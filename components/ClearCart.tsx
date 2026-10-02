'use client'
import { useEffect } from 'react'
import { saveCart } from '../lib/cart'

export default function ClearCart() {
  useEffect(() => {
    saveCart([])
  }, [])
  return null
}