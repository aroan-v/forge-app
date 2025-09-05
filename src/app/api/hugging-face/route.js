// app/api/huggingface/route.js (App Router example)

export async function POST(req) {
  try {
    const body = await req.json()

    // Grab the user's prompt from the request
    const { prompt } = body

    console.log('HF Token loaded:', process.env.HF_TOKEN ? '✅ yes' : '❌ no')

    // Call Hugging Face Inference API
    const response = await fetch(
      'https://api-inference.huggingface.co/models/google/flan-t5-small', // example model
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`, // safe server-side usage
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    )

    const result = await response.json()

    return new Response(JSON.stringify(result), { status: 200 })
  } catch (error) {
    console.error('HF API Error:', error)
    return new Response(JSON.stringify({ error: 'Something went wrong' }), { status: 500 })
  }
}
