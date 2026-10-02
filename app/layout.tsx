import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import NavBar from '../components/NavBar'

export const metadata: Metadata = {
  title: 'Engineer Shop',
  description: 'Tools for engineers',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
       <NavBar />
        {children}
        <footer className="text-center text-sm text-slate-500 py-8">
  <a href="/privacy" className="underline mr-4">Privacy Policy</a>
  <a href="/terms" className="underline">Terms of Service</a>
</footer>
      </body>
    </html>
  )
}