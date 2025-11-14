import OpenAI from 'openai'

export type Role = 'system' | 'user' | 'assistant'
export type ChatMessage = { role: Role; content: string }

export function validateOpenAIEnv(): { valid: true; model: string } | { valid: false; error: string } {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return { valid: false, error: 'Missing OPENAI_API_KEY environment variable' }
  }
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  return { valid: true, model }
}

export function createOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable')
  }
  return new OpenAI({ apiKey })
}
