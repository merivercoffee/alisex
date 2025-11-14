"use client"

import { useState } from 'react'

type Role = 'system' | 'user' | 'assistant'

type Message = {
  role: Role
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Something went wrong')
        return
      }
      const reply: Message = { role: 'assistant', content: String(data?.content ?? '') }
      setMessages((prev) => [...prev, reply])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Chat with OpenAI</h1>
      <div className="rounded border bg-white p-4">
        <ul className="space-y-3">
          {messages.length === 0 && (
            <li className="text-sm text-gray-500">No messages yet. Ask something below.</li>
          )}
          {messages.map((m, i) => (
            <li key={i} className="flex gap-3">
              <div className={`shrink-0 rounded px-2 py-1 text-xs ${m.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {m.role}
              </div>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </li>
          ))}
        </ul>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          aria-label="Message"
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
