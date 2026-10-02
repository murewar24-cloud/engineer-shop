export type CartItem = { product_id: number; quantity: number }

export function getCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]')
  } catch {
    return []
  }
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(cart))
  window.dispatchEvent(new Event('cart-updated'))
}

export function addToCart(product_id: number) {
  const cart = getCart()
  const found = cart.find((i) => i.product_id === product_id)
  if (found) found.quantity += 1
  else cart.push({ product_id, quantity: 1 })
  saveCart(cart)
}