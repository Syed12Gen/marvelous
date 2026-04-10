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