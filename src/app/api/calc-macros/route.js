import { InferenceClient } from '@huggingface/inference'

export async function POST(req) {
  try {
    const body = await req.json()

    const client = new InferenceClient(process.env.HF_TOKEN)

    const result = await client.chatCompletion({
      model: 'moonshotai/Kimi-K2-Instruct-0905',
      provider: 'groq',
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
      temperature: 0.5,
      top_p: 0.7,
    })

    return new Response(JSON.stringify(result), { status: 200 })
  } catch (err) {
    console.error('HF API Error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
