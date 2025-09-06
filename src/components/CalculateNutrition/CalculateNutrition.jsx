'use client'
import React from 'react'
import { Button } from '../ui/button'
import { sampleRawData } from '@/app/schemas/foodSchema'
import { useFoodStore } from '@/app/store/useFoodStore'
import SimpleCard from '../SimpleCard'

function CalculateNutrition() {
  const [content, setContent] = React.useState('')
  const setFoodBank = useFoodStore((s) => s.setFoodBank)
  const foodBank = useFoodStore((s) => s.foodBank)
  const fetchNutrition = async (food) => {
    const res = await fetch('/api/hugging-face', {
      method: 'POST',
      body: JSON.stringify({ mealData: sampleRawData }),
    })
    const data = await res.json()

    console.log(data.choices[0].message.content)
    setContent(data.choices[0].message.content)
  }

  console.log('foodBank', foodBank)

  const sample = {
    egg: {
      serving: 'piece',
      quantity: 1,
      calories: 75,
      protein: 6,
    },
    rice: {
      serving: 'cup',
      quantity: 1,
      calories: 200,
      protein: 4,
    },
    chickenBreast: {
      serving: 'gram',
      quantity: 100,
      calories: 165,
      protein: 31,
    },
  }

  return (
    <>
      <Button onClick={() => fetchNutrition(sampleRawData)}>Calculate Nutrition</Button>
      <div>{JSON.stringify(content)}</div>

      <SimpleCard>
        <Button onClick={() => setFoodBank(sample)}>Calculate Nutrition</Button>
        Food Bank
        {JSON.stringify(foodBank)}
      </SimpleCard>
    </>
  )
}

export default CalculateNutrition
