import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StarField from '@/components/StarField'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Maida Amjad | AI & Machine Learning Engineer Portfolio',
  description: 'Portfolio of Maida Amjad — AI/ML Engineer specializing in LLMs, RAG systems, computer vision, and generative AI. Based in Burewala, Pakistan. Open to AI/ML roles.',
  keywords: [
    'Maida Amjad',
    'AI Engineer',
    'Machine Learning Engineer',
    'ML Portfolio',
    'LLM Developer',
    'RAG Systems',
    'Generative AI',
    'Computer Vision',
    'Python Developer',
    'Deep Learning',
    'NLP Engineer',
    'AI Student Pakistan',
    'Next.js Portfolio',
    'Supabase',
    'AI Projects',
    'Burewala Pakistan',
  ],
  authors: [{ name: 'Maida Amjad' }],
  creator: 'Maida Amjad',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://maida-amjad.vercel.app',
    title: 'Maida Amjad | AI & Machine Learning Engineer',
    description: 'AI/ML Engineer specializing in LLMs, RAG systems, computer vision and generative AI. View projects, skills and certifications.',
    siteName: 'Maida Amjad Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maida Amjad | AI & ML Engineer',
    description: 'AI/ML Engineer specializing in LLMs, RAG systems and computer vision.',
    creator: '@MaidaAmjad',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
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
