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
          content: `You are a nutrition assistant. 
          Always return JSON with the same keys given.
          Insert two extra properties into each object: "calories" and "protein". 
          Do not add text outside of JSON.`,
        },
        {
          role: 'user',
          content: JSON.stringify(body), // body = your unregisteredFoods object
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
