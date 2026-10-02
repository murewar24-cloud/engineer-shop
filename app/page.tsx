import Link from 'next/link'
import { supabaseServer } from '@/lib/supabaseServer'
import { categoryIcon } from '@/lib/icons'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { data: categories } = await supabaseServer.from('categories').select('*')

  return (
    <main>
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tools every engineer needs</h1>
          <p className="text-lg mb-8 text-blue-100">Measure, build, test and stay safe, all in one shop.</p>
          <a href="#categories" className="bg-white text-blue-800 font-semibold px-6 py-3 rounded-full hover:bg-blue-50">
            Shop now
          </a>
        </div>
      </section>

      <section id="categories" className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Shop by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories?.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition p-6 text-center"
            >
              <div className="text-5xl mb-3">{categoryIcon(c.slug)}</div>
              <div className="font-semibold">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}