import { devLog } from '@/lib/logger'
import { Groq } from 'groq-sdk'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const groq = new Groq()

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `
          You are a nutrition assistant.
          
          STRICT RULES:
          1. Always return **valid JSON ONLY**, with no explanations, comments, or extra text.
          2. Preserve the exact hierarchy of the input JSON:
             - Top-level keys = groupId
             - Second-level keys = foodId
             - Values = objects
          3. For each food object, return ALL of the original keys unchanged (e.g., "food", "displayValue").
          4. Add exactly TWO new keys: "calories" and "protein".
          5. Do not rename, remove, or reorder existing keys.
          6. If an item cannot be recognized as food, exclude it silently (do not return it).
          7. Do NOT add any extra fields, metadata, or commentary.
          8. Ensure the output is strictly valid JSON that can be parsed without errors.
        `,
        },
        {
          role: 'user',
          content: JSON.stringify(body),
        },
      ],
      model: 'gemma2-9b-it',
      temperature: 0.5,
      max_completion_tokens: 1024,
      top_p: 0.7,
      stream: false,
      response_format: {
        type: 'json_object',
      },
      stop: null,
    })

    const content = chatCompletion.choices[0]?.message?.content
    devLog('content', content)
    const result = JSON.parse(content)

    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
