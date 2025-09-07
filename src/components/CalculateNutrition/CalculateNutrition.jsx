'use client'
import React from 'react'
import { Button } from '../ui/button'
import { sampleRawData } from '@/app/schemas/foodSchema'
import { useFoodStore } from '@/app/store/useFoodStore'
import SimpleCard from '../SimpleCard'
function CalculateNutrition() {
  const [content, setContent] = React.useState('') // holds any messages to show in UI
  const [isLoading, setIsLoading] = React.useState(false) // tracks loading state

  const getUnregisteredFoods = useFoodStore((s) => s.getUnregisteredFoods)
  const updateLoggedFoodWithNutrition = useFoodStore((s) => s.updateLoggedFoodWithNutrition)

  const unregisteredFoods = getUnregisteredFoods() // collect unregistered foods

  const fetchNutrition = async () => {
    // set loading state true before API call
    setIsLoading(true)
    setContent(
      `Getting data for ${Object.keys(unregisteredFoods)
        ?.map((food) => food)
        .join(', ')}`
    )

    try {
      const res = await fetch('/api/hugging-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unregisteredFoods), // pass foods to backend
      })

      const data = await res.json()
      const rawContent = data.choices[0].message.content

      let parsedContent
      try {
        parsedContent = JSON.parse(rawContent) // parse AI JSON response
      } catch (e) {
        console.error('Failed to parse JSON from model:', rawContent)
        parsedContent = null
      }

      if (parsedContent) {
        updateLoggedFoodWithNutrition(parsedContent)
        setContent('Nutrition data updated successfully ✅')
      } else {
        setContent('⚠️ Failed to parse nutrition data')
      }
    } catch (err) {
      console.error(err)
      setContent('❌ Error fetching nutrition data')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button onClick={fetchNutrition} disabled={isLoading}>
        {isLoading ? 'Calculating…' : 'Calculate Nutrition'}
      </Button>

      {isLoading && <p className="text-sm text-gray-500">{content}</p>}
      {!isLoading && content && <p className="text-sm font-medium">{content}</p>}
    </div>
  )
}

export default CalculateNutrition
