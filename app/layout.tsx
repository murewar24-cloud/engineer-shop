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
      </body>
    </html>
  )
}