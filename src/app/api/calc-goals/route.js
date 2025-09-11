import { InferenceClient } from '@huggingface/inference'

export async function POST(req) {
  try {
    const body = await req.json()

    const client = new InferenceClient(process.env.HF_TOKEN)

    // Debugging logs
    console.log('rawRequest', body)
    console.log('jsonStringified', JSON.stringify(body))

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
            2. Input will contain user details (age, height, weight, gender, activityLevel, goal).
            3. Output must be an object with exactly these keys:
               - "targetCalories": number
               - "targetProtein": number
            4. Do NOT return any other fields or metadata.
            5. Output must be strictly valid JSON that can be parsed without errors.
          `,
        },
        {
          role: 'user',
          content: JSON.stringify(body), // body = { age, height, weight, gender, activityLevel, goal }
        },
      ],
      temperature: 0.3, // lower temp = more consistent math
      top_p: 0.7,
    })

    return new Response(JSON.stringify(result), { status: 200 })
  } catch (err) {
    console.error('HF API Error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
