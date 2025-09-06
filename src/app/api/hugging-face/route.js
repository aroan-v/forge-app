import { InferenceClient } from '@huggingface/inference'

export async function POST(req) {
  try {
    const { mealData } = await req.json()

    const client = new InferenceClient(process.env.HF_TOKEN)

    console.log('rawRequest', mealData)
    console.log('jsonStringified', JSON.stringify(mealData))

    const result = await client.chatCompletion({
      model: 'moonshotai/Kimi-K2-Instruct-0905',
      provider: 'groq',
      messages: [
        {
          role: 'user',
          content: `Compute calories and protein for this meal list:\n${JSON.stringify(mealData)}`,
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
