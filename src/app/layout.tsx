import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Maida Amjad Portfolio',
  description: 'Building the future of intelligent applications. Specialized in LLMs, computer vision, and scalable cloud architectures.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background-dark font-display text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
