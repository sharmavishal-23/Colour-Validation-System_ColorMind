import { streamText } from 'ai'

export const maxDuration = 60

const systemPrompt = `You are ColorMind AI, an expert at analyzing images and suggesting color palettes. When given an image, you should:

1. **Identify Main Colors**: List the dominant colors you see in the image with their approximate hex codes
2. **Extract Background Color**: Specifically identify the background color 
3. **Suggest Color Palette**: Based on the image, suggest a cohesive 4-6 color palette with hex codes
4. **Explain Your Choices**: Briefly explain why these colors work well together
5. **Mood & Feeling**: Describe the mood or feeling the colors evoke
6. **Use Cases**: Suggest where this palette would work well (fashion, web design, interior, etc.)

Format your response clearly with sections. Always provide specific hex codes (e.g., #FF6B6B).
Be enthusiastic and helpful! Make color exploration fun and educational.`

export async function POST(req: Request) {
  try {
    const { imageBase64, mimeType } = await req.json()

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: 'No image provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const result = streamText({
      model: 'openai/gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please analyze this image and suggest colors based on it. Identify the main colors, background color, and suggest a beautiful palette. Provide hex codes for all colors.'
            },
            {
              type: 'image',
              image: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`,
            }
          ]
        }
      ],
      system: systemPrompt,
      abortSignal: req.signal,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Error analyzing image:', error)
    return new Response(JSON.stringify({ error: 'Failed to analyze image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
