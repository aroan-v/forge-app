'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import DaisyThemeWrapper from '../DaisyThemeWrapper'
import { useStatsStore } from '@/app/store/useStatsStore'
import { generateUserStats } from '@/lib/nutritionUtils'
import { devLog } from '@/lib/logger'

export default function MacroSetupForm({ scrollToTargetRef }) {
  // Local form states
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [gender, setGender] = useState('')
  const [activityLevel, setActivityLevel] = useState('')
  const [goal, setGoal] = useState('')

  const setUserData = useStatsStore((state) => state.setUserData)
  const setTargets = useStatsStore((state) => state.setTargets)
  const setShallowState = useStatsStore((state) => state.setShallowState)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const rawData = {
      name,
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      gender,
      activityLevel,
      goal,
    }

    const payload = {
      ...rawData,
      height: {
        value: rawData.height,
        unit: 'cm',
      },
      weight: {
        value: rawData.weight,
        unit: 'kg',
      },
    }

    const processedStats = generateUserStats(rawData)

    devLog('stats', processedStats)

    setShallowState({
      userComputedStats: processedStats,
    })

    localStorage.setItem('userStats', JSON.stringify(processedStats))

    // Scroll into the charts
    if (scrollToTargetRef.current) {
      devLog('scrollToTargetRef activated')
      scrollToTargetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return

    try {
      setUserData(payload)
      const res = await fetch('/api/calc-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      const rawContent = data.choices?.[0]?.message?.content

      let parsedContent
      try {
        parsedContent = JSON.parse(rawContent)
      } catch (e) {
        console.error('❌ Failed to parse AI response:', rawContent)
        parsedContent = null
      }

      if (parsedContent) {
        setTargets(parsedContent) // { targetCalories, targetProtein }
      }
    } catch (err) {
      console.error('❌ Error fetching AI targets:', err)
    } finally {
      // setIsLoading(false)
    }
  }

  return (
    <DaisyThemeWrapper className="w-full">
      <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
        <fieldset className="ds-fieldset bg-base-200 border-base-300 rounded-box space-y-2 border p-4">
          <label htmlFor="name" className="ds-label text-sm">
            Name (Optional)
          </label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={2}
          />

          <label className="ds-label">Age</label>
          <Input
            className="ds-input"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            min={12}
            max={100}
          />

          <label htmlFor="heightInput" className="ds-label">
            Height (cm)
          </label>
          <Input
            id="heightInput"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
            min={100}
            max={250}
          />

          <label htmlFor="weightInput" className="ds-label">
            Weight (kg)
          </label>
          <Input
            id="weightInput"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
            min={30}
            max={300}
          />

          <label id="gender-label" className="ds-label">
            Gender
          </label>
          <Select onValueChange={setGender} aria-labelledby="gender-label" name="gender">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>

          <label id="activity-label" className="ds-label">
            Activity Level
          </label>
          <Select
            onValueChange={setActivityLevel}
            aria-labelledby="activity-label"
            name="activityLevel"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary — little or no exercise</SelectItem>
              <SelectItem value="light">Lightly Active — 1–3 workouts/week</SelectItem>
              <SelectItem value="moderate">Moderately Active — 3–5 workouts/week</SelectItem>
              <SelectItem value="active">Active — 6–7 workouts/week</SelectItem>
              <SelectItem value="very-active">
                Very Active — intense exercise or physical job
              </SelectItem>
            </SelectContent>
          </Select>

          <label id="goal-label" className="ds-label">
            Goal
          </label>
          <Select onValueChange={setGoal} aria-labelledby="goal-label" name="goal">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cutting">Lose Weight / Cutting</SelectItem>
              <SelectItem value="bulking">Gain Muscle / Bulking</SelectItem>
              <SelectItem value="recomp">Maintain / Recomp</SelectItem>
              <SelectItem value="general_fitness">General Fitness</SelectItem>
              <SelectItem value="endurance">Endurance / Cardio Focus</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" variant="gradient" className="mt-4">
            Calculate my stats
          </Button>
        </fieldset>
      </form>
    </DaisyThemeWrapper>
  )
}
