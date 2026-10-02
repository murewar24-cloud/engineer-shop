import Link from 'next/link'

export default async function OrderSuccess({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-sm p-10 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold mb-3">Thank you!</h1>
        <p className="mb-2">Your order #{id} has been placed.</p>
        <p className="mb-6 text-slate-600">A confirmation email is on its way.</p>
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full">
          Back to shop
        </Link>
      </div>
    </main>
  )
}