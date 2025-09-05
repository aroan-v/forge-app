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

export default function MacroSetupForm() {
  // ✅ Local state for each input
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [gender, setGender] = useState('')
  const [activityLevel, setActivityLevel] = useState('')
  const [proteinGoal, setProteinGoal] = useState('')

  // useEffect(() => {
  //   async function getNutritionAdvice(prompt) {
  //     const response = await fetch('/api/hugging-face', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ prompt }),
  //     })

  //     const data = await response.json()
  //     console.log('Advice:', data)
  //     return data
  //   }

  //   // Example usage:
  //   getNutritionAdvice('Suggest me a 30g protein dinner.')
  // }, [])

  // ✅ Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()

    const data = {
      name,
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      gender,
      activityLevel,
    }

    console.log('Form submitted ✅', data)
    // Do whatever you want here (API, state, etc.)
  }

  return (
    <DaisyThemeWrapper>
      <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4">
        <fieldset className="ds-fieldset bg-base-200 border-base-300 rounded-box w-xs space-y-2 border p-4">
          <label htmlFor="name" className="ds-label text-sm">
            Name
          </label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
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

          <label htmlFor="genderInput" className="ds-label">
            Gender
          </label>
          <Select className="w-full" onValueChange={setGender}>
            <SelectTrigger id="genderInput">
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

          <label htmlFor="activityInput" className="ds-label">
            Activity Level
          </label>
          <Select onValueChange={setActivityLevel}>
            <SelectTrigger id="activityInput">
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary</SelectItem>
              <SelectItem value="light">Lightly Active</SelectItem>
              <SelectItem value="moderate">Moderately Active</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="very-active">Very Active</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" className="ds-btn mt-4 w-full">
            Save & Continue
          </Button>
        </fieldset>
      </form>
    </DaisyThemeWrapper>
  )
}
