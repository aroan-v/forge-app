'use client'
import React from 'react'
import { Button } from '../ui/button'
import { sampleRawData } from '@/app/schemas/foodSchema'
import { useFoodStore } from '@/app/store/useFoodStore'
import SimpleCard from '../SimpleCard'
import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

function CalculateNutrition() {
  const [content, setContent] = React.useState('') // holds any messages to show in UI
  const [isLoading, setIsLoading] = React.useState(false) // tracks loading state

  const getUnregisteredFoods = useFoodStore((s) => s.getUnregisteredFoods)
  const updateLoggedFoodWithNutrition = useFoodStore((s) => s.updateLoggedFoodWithNutrition)

  const unregisteredFoods = getUnregisteredFoods() // collect unregistered foods
  console.log('unregisteredFoods', unregisteredFoods)

  const fetchNutrition = async () => {
    setIsLoading(true)
    setContent(`Getting data for ${Object.keys(unregisteredFoods).join(', ')}`)

    try {
      const res = await fetch('/api/calc-macros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unregisteredFoods),
      })

      console.log('passed unregistered food to AI', unregisteredFoods)

      const data = await res.json()
      const rawContent = data.choices[0].message.content

      let parsedContent
      try {
        parsedContent = JSON.parse(rawContent)
      } catch (e) {
        console.error('Failed to parse JSON from model:', rawContent)
        parsedContent = null
      }

      if (parsedContent) {
        updateLoggedFoodWithNutrition(parsedContent)
        console.log('updatedLoggedFood', parsedContent)
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

  const fetchJustTheNutrition = () => {
    setIsLoading(true)
    console.log('Unregistered foods (raw)', unregisteredFoods)

    // Pretty-print JSON for easier debugging in UI
    setContent(`Unregistered Foods:\n${JSON.stringify(unregisteredFoods, null, 2)}`)

    setIsLoading(false)
  }

  return (
    <div className="space-y-4 text-center">
      {Object.keys(unregisteredFoods).length === 0 && (
        <span className="text-muted-foreground block text-xs font-medium">
          Add valid entries before AI can calculate what you ate!
        </span>
      )}
      <Button
        onClick={fetchNutrition}
        disabled={isLoading || Object.keys(unregisteredFoods).length === 0}
        variant="gradient"
      >
        <span className="relative z-10 flex gap-2 align-middle">
          {isLoading ? 'Calculating…' : 'Calculate Nutrition with AI'}
          {!isLoading && <Bot />}
        </span>
      </Button>

      {isLoading && <p className="text-muted-foreground text-sm">{content}</p>}

      {!isLoading && content && (
        <pre className="text-sm font-medium whitespace-pre-wrap">{content}</pre>
      )}

      <p className="text-muted-foreground text-xs">
        Powered by <code className="font-mono">moonshotai/Kimi-K2-Instruct-0905</code> on{' '}
        <code className="font-mono">groq</code>
      </p>
    </div>
  )

  return (
    <div className="space-y-4">
      <Button
        onClick={fetchNutrition}
        disabled={isLoading || Object.keys(unregisteredFoods).length === 0}
      >
        {isLoading ? 'Calculating…' : 'Calculate Nutrition'}
      </Button>
      {/* <Button onClick={fetchJustTheNutrition} disabled={isLoading}>
        {isLoading ? 'Showing…' : 'Show Pending Nutrition Data'}
      </Button> */}

      {isLoading && <p className="text-sm text-gray-500">{content}</p>}
      {!isLoading && content && (
        <pre className="text-sm font-medium whitespace-pre-wrap">{content}</pre>
      )}
    </div>
  )
}

export default CalculateNutrition
