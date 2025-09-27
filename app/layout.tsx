import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RBASIC-D64 | Educational Dartmouth BASIC Interpreter',
  description: 'Learn programming fundamentals through visual Dartmouth BASIC interpretation with real-time variable and array visualization.',
  keywords: ['BASIC', 'programming', 'education', 'interpreter', 'Dartmouth', 'learning'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}