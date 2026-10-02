export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-sm p-8 leading-relaxed">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-slate-500 mb-6">Last updated: October 2026</p>

        <p className="mb-4">
          Engineer Shop (&quot;we&quot;, &quot;us&quot;) sells tools for engineers. This page explains what
          information we collect and how we use it.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">What we collect</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Your name and email address, when you sign in with Google.</li>
          <li>Your delivery name and address, when you place an order.</li>
          <li>Your order details (items, quantities, totals).</li>
          <li>Your shopping cart, which is stored in your own browser.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">How we use it</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>To sign you in and keep your account secure.</li>
          <li>To process and deliver your orders.</li>
          <li>To send you order confirmation emails.</li>
          <li>To show you your past orders.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Who we share it with</h2>
        <p className="mb-4">
          We do not sell your information. We use trusted services to run the shop: Google (sign-in),
          Supabase (database), Mailgun (emails), and Vercel (hosting). They only handle your data to
          provide those services.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Your choices</h2>
        <p className="mb-4">
          You can ask us to delete your account and order data at any time by emailing us at the
          address below.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
        <p>Questions? Email murewar24@gmail.com.</p>
      </div>
    </main>
  )
}