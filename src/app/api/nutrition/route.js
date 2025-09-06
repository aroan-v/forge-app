// app/api/nutrition/route.js
let cache = {} // simple in-memory cache

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const food = searchParams.get('food')

    if (!food) {
      return new Response(JSON.stringify({ error: 'Food query is required' }), { status: 400 })
    }

    // Return cached result if exists
    if (cache[food]) {
      return new Response(JSON.stringify(cache[food]), { status: 200 })
    }

    // Call CalorieNinjas API
    const response = await fetch(
      `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(food)}`,
      {
        headers: { 'X-Api-Key': process.env.CALORIE_NINJAS_TOKEN },
      }
    )

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch nutrition data' }), {
        status: 500,
      })
    }

    const data = await response.json()

    // Cache result (simple in-memory; resets on server restart)
    cache[food] = data

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (err) {
    console.error('Nutrition API error:', err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
}
