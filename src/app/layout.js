import { Poppins, Inter } from 'next/font/google'
import './globals.css'
import ClientProvider from '@/components/ClientProvider'

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'AI Macro Calculator',
  description:
    'A smart meal tracker that simplifies logging: just type what you ate and the serving size (defaults to grams), and AI calculates calories and protein accurately. No more rigid presets—just fast, precise tracking with Gemma and Groq.',
  openGraph: {
    title: 'AI Macro Calculator',
    description:
      'A smart meal tracker that simplifies logging: just type what you ate and the serving size (defaults to grams), and AI calculates calories and protein accurately. No more rigid presets—just fast, precise tracking with Gemma and Groq.',
    url: 'https://ai-macro-calculator.vercel.app',
    siteName: 'AI Macro Calculator',
    images: [
      {
        url: '/link-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Macro Calculator preview',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Macro Calculator',
    description:
      'A smart meal tracker that simplifies logging: just type what you ate and the serving size (defaults to grams), and AI calculates calories and protein accurately. No more rigid presets—just fast, precise tracking with Gemma and Groq.',
    images: ['/link-preview.jpg'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html className={`${poppins.variable} ${inter.variable} antialiased`} lang="en">
      <body className="pb-20">
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  )
}
