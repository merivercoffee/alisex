import { type ChatMessage, validateOpenAIEnv, createOpenAIClient } from '@/lib/openai'

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
}

function isValidRole(role: unknown): role is ChatMessage['role'] {
  return role === 'system' || role === 'user' || role === 'assistant'
}

function validateBody(body: any): body is { messages: ChatMessage[] } {
  if (!body || typeof body !== 'object') return false
  if (!Array.isArray(body.messages)) return false
  for (const m of body.messages) {
    if (!m || typeof m !== 'object') return false
    if (!isValidRole(m.role)) return false
    if (typeof m.content !== 'string') return false
  }
  return true
}

export async function POST(req: Request) {
  const env = validateOpenAIEnv()
  if (!env.valid) {
    return json({ error: env.error }, { status: 400 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!validateBody(body)) {
    return json({ error: 'Invalid request body: expected { messages: Array<{ role, content }> }' }, { status: 400 })
  }

  try {
    const openai = createOpenAIClient()
    const { messages } = body

    const completion = await openai.chat.completions.create({
      model: env.model,
      messages,
      temperature: 0.7,
    })

    const content = completion.choices?.[0]?.message?.content ?? ''

    return json({ content })
  } catch (err) {
    // TODO: Support streaming SSE for better UX
    const message = err instanceof Error ? err.message : 'Unknown error calling OpenAI'
    // Hide internal error details; return generic error
    return json({ error: `Failed to generate response: ${message}` }, { status: 500 })
  }
}
