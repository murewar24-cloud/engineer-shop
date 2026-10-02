'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginButton() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })
  }, [])

  const login = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })

  const logout = async () => {
    await supabase.auth.signOut()
    setEmail(null)
  }

  if (email) {
    return (
      <div className="flex items-center gap-3">
        <span>Signed in as {email}</span>
        <button onClick={logout} className="bg-gray-700 text-white px-4 py-2 rounded">
          Sign out
        </button>
      </div>
    )
  }

  return (
    <button onClick={login} className="bg-blue-600 text-white px-4 py-2 rounded">
      Sign in with Google
    </button>
  )
}