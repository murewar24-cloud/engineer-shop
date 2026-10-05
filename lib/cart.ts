import { supabase } from './supabase'

export type CartItem = { product_id: number; quantity: number }

export async function getCart(): Promise<CartItem[]> {
  const { data: u } = await supabase.auth.getUser()
  if (!u.user) return []
  const { data } = await supabase
    .from('cart_items')
    .select('product_id, quantity')
    .eq('user_id', u.user.id)
  return (data as CartItem[]) ?? []
}

export async function setQuantity(product_id: number, quantity: number): Promise<boolean> {
  const { data: u } = await supabase.auth.getUser()
  if (!u.user) return false
  if (quantity <= 0) {
    await supabase.from('cart_items').delete().eq('user_id', u.user.id).eq('product_id', product_id)
  } else {
    await supabase
      .from('cart_items')
      .upsert({ user_id: u.user.id, product_id, quantity }, { onConflict: 'user_id,product_id' })
  }
  window.dispatchEvent(new Event('cart-updated'))
  return true
}

export async function addToCart(product_id: number): Promise<boolean> {
  const cart = await getCart()
  const found = cart.find((i) => i.product_id === product_id)
  return setQuantity(product_id, (found?.quantity ?? 0) + 1)
}

export async function clearCart() {
  const { data: u } = await supabase.auth.getUser()
  if (!u.user) return
  await supabase.from('cart_items').delete().eq('user_id', u.user.id)
  window.dispatchEvent(new Event('cart-updated'))
}