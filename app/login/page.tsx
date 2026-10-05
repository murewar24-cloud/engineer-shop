'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const signUp = async () => {
    setMsg('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return setMsg(error.message)
    if (!data.session) return setMsg('Account created. Now click Sign in.')
    window.location.href = '/'
  }

  const signIn = async () => {
    setMsg('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return setMsg(error.message)
    window.location.href = '/'
  }

  const google = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border border-slate-300 rounded-lg p-3 text-black"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (6+ characters)"
          className="border border-slate-300 rounded-lg p-3 text-black"
        />
        {msg && <p className="text-red-600">{msg}</p>}
        <button onClick={signIn} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full">
          Sign in
        </button>
        <button onClick={signUp} className="bg-slate-200 hover:bg-slate-300 font-semibold px-6 py-3 rounded-full">
          Create new account
        </button>
        <button onClick={google} className="border border-slate-300 font-semibold px-6 py-3 rounded-full">
          Continue with Google
        </button>
      </div>
    </main>
  )
}