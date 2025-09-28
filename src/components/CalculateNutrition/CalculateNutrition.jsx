'use client'
import React from 'react'
import { useFoodStoreVersionTwo } from '@/app/store/useFoodStore'
import { devLog } from '@/lib/logger'
import { Card } from '../ui/card'
import CalculateButton from '../CalculateButton'

function CalculateNutrition({ ref }) {
  const [content, setContent] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [localUnregisteredFood, setLocalUnregisteredFood] = React.useState({})
  const [buttonDisabled, setButtonDisabled] = React.useState(false)

  const getUnregisteredFoods = useFoodStoreVersionTwo((s) => s.getUnregisteredFoods)
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

  const getLatestUnregisteredFoods = () => {
    const currentUnregisteredFood = getUnregisteredFoods()
    devLog('currentUnregisteredFood', currentUnregisteredFood)

    const unregisteredFoodArray = Object.values(currentUnregisteredFood).map(({ food }) => food)

    devLog('unregisteredFoodArray', unregisteredFoodArray)

    if (unregisteredFoodArray.length > 0) {
      setLocalUnregisteredFood(unregisteredFoodArray)
      setContent(`Getting data for ${unregisteredFoodArray.join(', ')}`)
      fetchNutrition(currentUnregisteredFood)
    } else {
      setContent('Please input your food and amount before trying to send to AI!')
    }
  }

  return (
    <div className="space-y-4 text-center">
      {isLoading && <p className="text-muted-foreground h-5 text-sm">{content}</p>}

      <CalculateButton onClick={getLatestUnregisteredFoods} disabled={isLoading || buttonDisabled}>
        {isLoading ? 'Calculating…' : 'Calculate Nutrition with AI'}
      </CalculateButton>
      <p className="text-muted-foreground text-xs">
        Powered by <code className="font-mono">gemma2-9b-it</code> on{' '}
        <code className="font-mono">groq</code>
      </p>

      <BadResponsesSection />
    </div>
  )
}

export default CalculateNutrition

function BadResponsesSection({}) {
  const badNutritionResponses = useFoodStoreVersionTwo((s) => s.badNutritionResponses)
  const setShallowState = useFoodStoreVersionTwo((s) => s.setShallowState)

  React.useEffect(() => {
    let timer
    if (badNutritionResponses.length > 0) {
      timer = setTimeout(() => {
        setShallowState({
          badNutritionResponses: [],
        })
      }, 5000)
    }
    return () => clearTimeout(timer)
  }, [badNutritionResponses, setShallowState])

  return (
    <>
      {badNutritionResponses.length > 0 && (
        <Card className="border-2 border-red-400">
          <h4 className="font-bold">Skipped Foods</h4>
          <p className="mt-1 text-sm">
            Oops! Couldn’t read data for:{' '}
            {badNutritionResponses.map((entry) => entry.food).join(', ')}
          </p>
        </Card>
      )}
    </>
  )
}
