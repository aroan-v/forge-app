'use client'
import CalculateNutrition from '@/components/CalculateNutrition'
import DaisyThemeWrapper from '@/components/DaisyThemeWrapper'
import MealTable from '@/components/MealTable'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useFoodStoreVersionTwo } from './store/useFoodStore'
import { NutritionNotice } from '@/components/NutritionNotice'
import CircularProgress from '@/components/CircularProgress'
import { BicepsFlexed, Hamburger, SquarePlus } from 'lucide-react'
import { useStatsStore } from './store/useStatsStore'
import { devLog } from '@/lib/logger'
import { ConfirmDialogWithTrigger } from '@/components/ConfirmDialog'
import AccountSetupNotice from '@/components/AccountSetupNotice'
import Hero from '@/components/Hero'
import Link from 'next/link'

export default function Home() {
  const addFoodGroup = useFoodStoreVersionTwo((s) => s.addFoodGroup)
  const foodGroups = useFoodStoreVersionTwo((s) => s.foodGroups)
  const scrollIntoTargetsRef = React.useRef(null)

  devLog('foodGroups', foodGroups)

  const title = 'Track what you ate today!'
  const description = (
    <>
      Type in the food you ate and the amount for each. We use the
      <span className="text-primary font-medium"> Gemma-2 model </span> — a powerful AI from Google
      DeepMind — running on Groq&apos;s LPU hardware to instantly calculate the calories and protein
      for your meal.
    </>
  )
  return (
    <DaisyThemeWrapper className="flex flex-col items-center space-y-6 p-6">
      <Hero title={title} description={description}>
        <StartFreshSection />
        <p className="text-muted-foreground hover:text-accent text-xs">
          <Link href="/setup" className="hover:underline">
            Go to profile
          </Link>
        </p>
      </Hero>

      <TargetsSection ref={scrollIntoTargetsRef} />
      <NutritionNotice />
      <div className="w-full max-w-xl space-y-6">
        {foodGroups.map((id) => (
          <MealTable key={id} groupId={id} />
        ))}

        <Button size="stretch" variant="defaultOutline" onClick={addFoodGroup}>
          <SquarePlus />
          Add Food Group
        </Button>
      </div>
      <CalculateNutrition ref={scrollIntoTargetsRef} />
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

function TargetsSection({ ref }) {
  let userComputedStats = useStatsStore((s) => s.userComputedStats)
  const mealsById = useFoodStoreVersionTwo((s) => s.mealsById)

  const {
    totalCalories,
    totalProtein,
    totalCaloriesPercent,
    totalProteinPercent,
    remainingCalories,
    remainingProtein,
    isOverCaloriesTarget,
    isOverProteinTarget,
    overCalories,
    overProtein,
  } = React.useMemo(() => {
    const totals = { totalCalories: 0, totalProtein: 0 }

    for (const id in mealsById) {
      totals.totalCalories += mealsById[id].calories || 0
      totals.totalProtein += mealsById[id].protein || 0
    }

    const targetCalories = userComputedStats?.calorieGoal || 1
    const targetProtein = userComputedStats?.proteinTarget || 1

    // totals.totalCalories = 3000
    // totals.totalProtein = 3000

    const rawCaloriesPercent = (totals.totalCalories / targetCalories) * 100
    const rawProteinPercent = (totals.totalProtein / targetProtein) * 100

    devLog('running totalCalories soFar', totals.totalCalories)
    devLog('targetProtein', targetProtein)

    return {
      totalCalories: totals.totalCalories,
      totalProtein: totals.totalProtein,
      totalCaloriesPercent: Math.min(rawCaloriesPercent, 100),
      totalProteinPercent: Math.min(rawProteinPercent, 100),
      remainingCalories: Math.max(targetCalories - totals.totalCalories, 0),
      remainingProtein: Math.max(targetProtein - totals.totalProtein, 0),
      isOverCaloriesTarget: rawCaloriesPercent > 100,
      isOverProteinTarget: rawProteinPercent > 100,
      overCalories: Math.max(totals.totalCalories - targetCalories, 0),
      overProtein: Math.max(totals.totalProtein - targetProtein, 0),
    }
  }, [mealsById, userComputedStats])

  devLog('totalCaloriesPercent', totalCaloriesPercent)
  devLog('remainingCalories', remainingCalories)
  devLog('overCalories', overCalories)

  return (
    <div>
      <AccountSetupNotice />
      <div ref={ref} className="flex max-w-lg justify-center gap-4 p-4">
        <CircularProgress
          color={isOverCaloriesTarget && userComputedStats ? 'destructive' : 'primary'}
          totalValue={totalCalories}
          icon={Hamburger}
          overValue={overCalories}
          hasUserComputedStats={!!userComputedStats}
          remainingValue={remainingCalories}
          label={'Calories consumed:'}
          unit={'kcal'}
          percent={totalCaloriesPercent}
        />

        <CircularProgress
          color={isOverProteinTarget && userComputedStats ? 'destructive' : 'secondary'}
          hasUserComputedStats={!!userComputedStats}
          totalValue={totalProtein}
          icon={BicepsFlexed}
          overValue={overProtein}
          remainingValue={remainingProtein}
          label={'Protein consumed:'}
          unit={'grams'}
          percent={totalProteinPercent}
        />
      </div>
    </div>
  )
}

function StartFreshSection() {
  const resetData = useFoodStoreVersionTwo((s) => s.resetData)

  return (
    <ConfirmDialogWithTrigger
      title="Reset All Data?"
      dialogDescription="This will erase all your meals and groups. Are you sure you want to start fresh?"
      confirmationContent="Yes, reset"
      handleConfirmation={resetData}
    >
      <Button variant="primaryOutline">Start Fresh</Button>
    </ConfirmDialogWithTrigger>
  )
}
