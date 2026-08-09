import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StarField from '@/components/StarField'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Maida Amjad Portfolio',
  description: 'Building the future of intelligent applications. Specialized in LLMs, computer vision, and scalable cloud architectures.',
  verification: {
    google: "2BhWXxGgloO057DUqBnUARPsWVF9AyyLjHAc396zISY",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={`${inter.className} bg-background-dark text-slate-100 antialiased`}>
        <StarField />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
