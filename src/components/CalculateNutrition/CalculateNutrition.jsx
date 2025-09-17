'use client'
import React from 'react'
import { Button } from '../ui/button'
import { useFoodStoreVersionTwo } from '@/app/store/useFoodStore'
import { Bot } from 'lucide-react'
import { devLog } from '@/lib/logger'
import { Card } from '../ui/card'

function CalculateNutrition({ ref }) {
  const [content, setContent] = React.useState('') // holds any messages to show in UI
  const [isLoading, setIsLoading] = React.useState(false) // tracks loading state
  const [localUnregisteredFood, setLocalUnregisteredFood] = React.useState({})
  const [buttonDisabled, setButtonDisabled] = React.useState(false)

  const getUnregisteredFoods = useFoodStoreVersionTwo((s) => s.getUnregisteredFoods)
  const badNutritionResponses = useFoodStoreVersionTwo((s) => s.badNutritionResponses)
  const saveToLocalStorage = useFoodStoreVersionTwo((s) => s.saveToLocalStorage)

  const updateLoggedFoodWithNutrition = useFoodStoreVersionTwo(
    (s) => s.updateLoggedFoodWithNutrition
  )

  // Auto clear content
  React.useEffect(() => {
    let timer
    if (content) {
      timer = setTimeout(() => {
        setContent('')
        setButtonDisabled(false)
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [content])

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

      devLog('resonseReceived', res)

      // Manual check
      if (!res.ok) {
        throw new Error(`Server responded with a ${res.status} status.`)
      }

      const data = await res.json()
      devLog('dataReceived', data)

      if (data) {
        updateLoggedFoodWithNutrition(data)
        saveToLocalStorage()
        devLog('updatedLoggedFood', data)
        setContent('Nutrition data updated successfully ✅')
      } else {
        setContent('⚠️ Failed to parse nutrition data')
      }

      setTimeout(() => setContent(''), 3000)
    } catch (err) {
      console.error(err)
      setButtonDisabled(true)
      setContent('❌ Error fetching nutrition data')
    } finally {
      setIsLoading(false)

      // Scroll into the charts
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const unregisteredFoods = { test: 'test' }

  const getLatestUnregisteredFoods = () => {
    const currentUnregisteredFood = getUnregisteredFoods()
    devLog('currentUnregisteredFood', currentUnregisteredFood)

    const unregisteredFoodArray = Object.values(currentUnregisteredFood).map(({ food }) => food)

    devLog('unregisteredFoodArray', unregisteredFoodArray)

    if (unregisteredFoodArray.length > 0) {
      setLocalUnregisteredFood(unregisteredFoodArray)
      setContent(`Getting data for ${unregisteredFoodArray.join(', ')}`)
      fetchNutrition(currentUnregisteredFood)
    }
  }

  return (
    <div className="space-y-4 text-center">
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
        Powered by <code className="font-mono">gemma2-9b-it</code> on{' '}
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
  devLog('badResponseData', data)
  return (
    <Card>
      <h4 className="font-bold">Skipped Foods</h4>
      <p className="mt-1 text-sm">
        Oops! Couldn’t read data for: {data.map((entry) => entry.food).join(', ')}
      </p>
    </Card>
  )
}
