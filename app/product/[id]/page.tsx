import Link from 'next/link'
import { supabaseServer } from '@/lib/supabaseServer'
import { categoryIcon } from '@/lib/icons'
import AddToCartButton from '@/components/AddToCartButton'

export const dynamic = 'force-dynamic'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: product } = await supabaseServer
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) return <main className="p-8">Product not found.</main>

  const { data: category } = await supabaseServer
    .from('categories')
    .select('slug')
    .eq('id', product.category_id)
    .single()

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <Link href="/" className="text-blue-700 hover:underline">← Home</Link>
      <div className="grid md:grid-cols-2 gap-8 mt-6 bg-white rounded-xl shadow-sm p-6">
        <div className="bg-slate-100 rounded-xl h-64 flex items-center justify-center text-8xl overflow-hidden">
  {product.image_url ? (
    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
  ) : (
    categoryIcon(category?.slug)
  )}
</div>
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-slate-600 mb-4">{product.description}</p>
          <p className="text-3xl font-bold text-blue-700 mb-2">₦{Number(product.price).toFixed(2)}</p>
          <p className="text-sm text-slate-500 mb-6">{product.stock} in stock</p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </main>
  )
}