import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { POST } from '@/app/api/chat/route'

const ORIGINAL_ENV = process.env

describe('/api/chat POST', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it('returns 400 when missing API key', async () => {
    delete process.env.OPENAI_API_KEY
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/Missing OPENAI_API_KEY/i)
  })

  it('returns 400 when invalid body', async () => {
    process.env.OPENAI_API_KEY = 'sk-test'
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ what: 'is this?' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data.error).toMatch(/Invalid request body/i)
  })
})
