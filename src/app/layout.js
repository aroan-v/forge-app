import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ClientProvider from '@/components/ClientProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'AI Macro Calculator',
  description: 'Track your daily macros with AI-powered food analysis.',
  openGraph: {
    title: 'AI Macro Calculator',
    description:
      'AI-powered macro calculator that computes calories and protein based on your stats and meals.',
    url: 'https://ai-macro-calculator.vercel.app',
    siteName: 'Macro Calculator with AI',
    images: [
      {
        url: 'https://ai-macro-calculator.vercel.app/link-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'Macro Calculator with AI preview thumbnail',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Macro Calculator with AI – Nutrition & Health Tracker',
    description:
      'AI-powered macro calculator that computes calories and protein based on your stats and meals.',
    images: ['https://ai-macro-calculator.vercel.app/link-preview.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}>
      <ClientProvider>
        <body className="pb-20">{children}</body>
      </ClientProvider>
    </html>
  )
}
