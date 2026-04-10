import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function analyzeMessages(messages: string[]) {
  const prompt = `
Return ONLY valid JSON. No markdown. No backticks. No extra commentary.

Schema:
{
  "summary": string,
  "tone": "safe" | "tense" | "targeted" | "bullying",
  "likely_targeted_user": string | null
}

Chat transcript:
${messages.join('\n')}
`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  return response
}

export async function bullyEmpathyMirror(params: {
  message: string
  groupType: string
  transcript?: string[]
}): Promise<string> {
  const { message, groupType, transcript } = params

  const contextBlock = transcript && transcript.length > 0
    ? `\nRecent conversation context:\n${transcript.join('\n')}\n`
    : ''

  const prompt = `You are helping someone reflect on how their message may have landed.
Group type: ${groupType}${contextBlock}
Message sent: "${message}"

Write 2–3 sentences of plain text only — no markdown, no lists, no JSON.
First, describe how this message likely felt to receive. Then suggest a gentler way to say the same thing in one sentence.`

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 150,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const text = (response as any)?.content?.[0]?.text ?? ''
  const trimmed = text.trim()
  if (!trimmed) throw new Error('No empathy mirror text returned')
  return trimmed
}