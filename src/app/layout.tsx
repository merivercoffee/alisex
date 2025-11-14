import type { Metadata } from 'next'
import Link from 'next/link'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'alisex – Next.js + OpenAI Chat Demo',
  description: 'Starter template with a minimal OpenAI chat integration',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-semibold">alisex</Link>
            <nav className="space-x-4 text-sm">
              <Link href="/">Home</Link>
              <Link href="/chat">Chat</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
