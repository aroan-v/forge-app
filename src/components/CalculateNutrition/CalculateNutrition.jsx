'use client'
import React from 'react'
import { Button } from '../ui/button'

import { sampleRawData } from '@/app/schemas/foodSchema'
import { useFoodStoreVersionTwo } from '@/app/store/useFoodStore'
import SimpleCard from '../SimpleCard'
import { Bot } from 'lucide-react'
import { cn } from '@/lib/utils'
import { devLog } from '@/lib/logger'
import { Card } from '../ui/card'

function CalculateNutrition() {
  const [content, setContent] = React.useState('') // holds any messages to show in UI
  const [isLoading, setIsLoading] = React.useState(false) // tracks loading state
  const [localUnregisteredFood, setLocalUnregisteredFood] = React.useState({})
  const [buttonDisabled, setButtonDisabled] = React.useState(false)

  const getUnregisteredFoods = useFoodStoreVersionTwo((s) => s.getUnregisteredFoods)
  const badNutritionResponses = useFoodStoreVersionTwo((s) => s.badNutritionResponses)

  const updateLoggedFoodWithNutrition = useFoodStoreVersionTwo(
    (s) => s.updateLoggedFoodWithNutrition
  )

  devLog('localUnregisteredFood', localUnregisteredFood)
  devLog('badNutritionResponses', badNutritionResponses)

  const fetchNutrition = async (unregisteredFoods) => {
    setIsLoading(true)

    try {
      const res = await fetch('/api/calc-macros-groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(unregisteredFoods),
      })

      console.log('passed unregistered food to AI', unregisteredFoods)

      devLog('resonseReceived', res)

      // Manual check
      if (!res.ok) {
        throw new Error(`Server responded with a ${res.status} status.`)
      }

      const data = await res.json()
      // let parsedContent = {
      //   // ✅ Good ones
      //   sinangag2023: {
      //     food: 'Garlic Fried Rice (Sinangag)',
      //     displayValue: '200 g',
      //     calories: 340,
      //     protein: 6.4,
      //   },
      //   itlog2023: {
      //     food: 'Fried Egg',
      //     displayValue: '2 pcs',
      //     calories: 184,
      //     protein: 12.4,
      //   },
      //   longganisa_123: {
      //     food: 'Longganisa (Sweet Pork Sausage)',
      //     displayValue: '3 pcs',
      //     calories: 285,
      //     protein: 15.3,
      //   },
      //   ensalada2023: {
      //     food: 'Tomato & Cucumber Side Salad',
      //     displayValue: '100 g',
      //     calories: 18,
      //     protein: 0.9,
      //   },

      //   // ❌ Bad Case 1: Unknown ID
      //   mysteryDish999: {
      //     food: 'AI Glitched Dish',
      //     displayValue: '1 serving',
      //     calories: 420,
      //     protein: 9,
      //   },
      //   // ❌ Bad Case 2: Known ID but invalid nutrition
      //   itlog2023_clone: {
      //     food: 'Weird Duplicate Egg',
      //     displayValue: '2 pcs',
      //     calories: null,
      //     protein: null,
      //   },

      //   // ❌ Bad Case 3: Known ID but only one valid field (edge case)
      //   sinangag2023_fake: {
      //     food: 'Rice with Missing Protein',
      //     displayValue: '150 g',
      //     calories: 200,
      //     protein: null,
      //   },
      // }

      devLog('dataReceived', data)

      if (data) {
        updateLoggedFoodWithNutrition(data)
        devLog('updatedLoggedFood', data)
        setContent('Nutrition data updated successfully ✅')
      } else {
        setContent('⚠️ Failed to parse nutrition data')
      }
    } catch (err) {
      console.error(err)
      setButtonDisabled(true)
      setContent('❌ Error fetching nutrition data')
    } finally {
      setIsLoading(false)
    }
  }

  const unregisteredFoods = { test: 'test' }

  const getLatestUnregisteredFoods = () => {
    const currentUnregisteredFood = getUnregisteredFoods()
    devLog('currentUnregisteredFood', currentUnregisteredFood)

    const unregisteredFoodArray = Object.values(currentUnregisteredFood).map(({ food }) => food)

    if (unregisteredFoodArray.length > 0) {
      setLocalUnregisteredFood(unregisteredFoodArray)
      setContent(`Getting data for ${unregisteredFoodArray.join(', ')}`)
      fetchNutrition(currentUnregisteredFood)
    }
  }

  return (
    <div className="space-y-4 text-center">
      {/* {) === 0 && (
        <span className="text-muted-foreground block text-xs font-medium">
          Add valid entries before AI can calculate what you ate!
        </span>
        
      )} */}

      {isLoading && <p className="text-muted-foreground text-sm">{content}</p>}

      {!isLoading && content && (
        <pre className="text-sm font-medium whitespace-pre-wrap">{content}</pre>
      )}

      <Button
        onClick={getLatestUnregisteredFoods}
        disabled={isLoading || buttonDisabled}
        variant="gradient"
      >
        <span className="relative z-10 flex gap-2 align-middle">
          {isLoading ? 'Calculating…' : 'Calculate Nutrition with AI'}
          {!isLoading && <Bot />}
        </span>
      </Button>
      <p className="text-muted-foreground text-xs">
        Powered by <code className="font-mono">moonshotai/Kimi-K2-Instruct-0905</code> on{' '}
        <code className="font-mono">groq</code>
      </p>

      {badNutritionResponses.length > 0 && <BadResponsesSection data={badNutritionResponses} />}
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

function BadResponsesSection({ data = [] }) {
  return (
    <Card>
      <h4 className="font-bold">Skipped Foods</h4>
      <p className="mt-1 text-sm">
        Oops! Couldn’t read data for: {data.map((entry) => entry.food).join(', ')}
      </p>
    </Card>
  )
}
