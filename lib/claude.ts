import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function analyzeMessages(messages: string[]) {
  const prompt = `
Analyze the following group chat messages.

Return a JSON object with:
- summary (short explanation of conversation)
- tone (safe, tense, targeted, bullying)
- likely_targeted_user (or null)

Messages:
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