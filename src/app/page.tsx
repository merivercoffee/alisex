import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to alisex</h1>
      <p className="text-gray-700">
        This is a production-ready Next.js + TypeScript + Tailwind starter with a minimal OpenAI Chat demo.
      </p>
      <div>
        <Link
          href="/chat"
          className="inline-flex rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Try the Chat demo
        </Link>
      </div>
      <section className="prose max-w-none">
        <h2>Getting started</h2>
        <ol>
          <li>Copy .env.example to .env and add your OPENAI_API_KEY.</li>
          <li>Run pnpm install</li>
          <li>Start the dev server with pnpm dev and open http://localhost:3000</li>
        </ol>
      </section>
    </div>
  )
}
