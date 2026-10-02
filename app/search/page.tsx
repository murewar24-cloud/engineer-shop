import Link from 'next/link'
import { supabaseServer } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

type Product = { id: number; name: string; price: number; image_url: string | null }

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const term = q.trim().replace(/[%,()]/g, '')

  let products: Product[] = []
  if (term) {
    const { data } = await supabaseServer
      .from('products')
      .select('id, name, price, image_url')
      .or(`name.ilike.%${term}%,description.ilike.%${term}%`)
    products = (data as Product[]) ?? []
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Results for &quot;{q}&quot;</h1>
      {products.length === 0 ? (
        <p className="text-slate-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.id}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition overflow-hidden"
            >
              <div className="bg-slate-100 h-36 flex items-center justify-center text-6xl overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  '🛠️'
                )}
              </div>
              <div className="p-4">
                <div className="font-semibold">{p.name}</div>
                <div className="text-blue-700 font-bold">₦{Number(p.price).toFixed(2)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}