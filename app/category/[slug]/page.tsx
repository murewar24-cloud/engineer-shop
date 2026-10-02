import Link from 'next/link'
import { supabaseServer } from '@/lib/supabaseServer'
import { categoryIcon } from '@/lib/icons'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { data: category } = await supabaseServer
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  const { data: products } = await supabaseServer
    .from('products')
    .select('*')
    .eq('category_id', category?.id)

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/" className="text-blue-700 hover:underline">← Back</Link>
      <h1 className="text-3xl font-bold my-6">{category?.name}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {products?.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition overflow-hidden"
          >
            <div className="bg-slate-100 h-36 flex items-center justify-center text-6xl overflow-hidden">
  {p.image_url ? (
    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
  ) : (
    categoryIcon(slug)
  )}
</div>
            <div className="p-4">
              <div className="font-semibold">{p.name}</div>
              <div className="text-blue-700 font-bold">${Number(p.price).toFixed(2)}</div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}