import Link from 'next/link'

export default async function OrderSuccess({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <main className="p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-4">Thank you!</h1>
      <p className="mb-2">Your order #{id} has been placed.</p>
      <p className="mb-6">A confirmation email is on its way.</p>
      <Link href="/" className="underline">Back to shop</Link>
    </main>
  )
}