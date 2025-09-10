'use client'
import CalculateNutrition from '@/components/CalculateNutrition'
import DaisyThemeWrapper from '@/components/DaisyThemeWrapper'
import MealTable from '@/components/MealTable'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useFoodStore } from './store/useFoodStore'

export default function Home() {
  const loggedFood = useFoodStore((s) => s.loggedFood)
  const addFoodGroup = useFoodStore((s) => s.addFoodGroup)

  console.log('loggedFood', loggedFood)

  return (
    <DaisyThemeWrapper className="flex flex-col items-center space-y-6 p-6">
      <Hero />

      {loggedFood.map(({ name, id, meals }) => (
        <MealTable key={id} mealName={name} meals={meals} groupId={id} />
      ))}

      <CalculateNutrition />

      {/* ✅ New Group Button */}
      <Button variant="default" onClick={addFoodGroup}>
        + Add New Group
      </Button>
    </DaisyThemeWrapper>
  )
}

function MealSection() {
  return (
    <div className="ds-tabs ds-tabs-lift">
      <label className="ds-tab">
        <input type="radio" name="my_tabs_4" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="me-2 size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
          />
        </svg>
        Live
      </label>
      <div className="ds-tab-content bg-base-100 border-base-300 p-6">ds-tab content 1</div>

      <label className="ds-tab">
        <input type="radio" name="my_tabs_4" defaultChecked />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="me-2 size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
          />
        </svg>
        Laugh
      </label>
      <div className="ds-tab-content bg-base-100 border-base-300 p-6">ds-tab content 2</div>

      <label className="ds-tab">
        <input type="radio" name="my_tabs_4" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="me-2 size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
        Love
      </label>
      <div className="ds-tab-content bg-base-100 border-base-300 p-6">ds-tab content 3</div>
    </div>
  )
}

function Hero() {
  return (
    <div className="hero p-6">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-xl font-bold">{'Track what you ate today!'}</h1>
          <p className="py-3">
            Tell us a bit about yourself—your height, weight, age, and activity level—and we’ll
            calculate the perfect protein and calorie targets to fuel your day.
          </p>
        </div>
      </div>
    </div>
  )
}
