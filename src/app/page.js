'use client'
import CalculateNutrition from '@/components/CalculateNutrition'
import DaisyThemeWrapper from '@/components/DaisyThemeWrapper'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useFoodStoreVersionTwo } from './store/useFoodStore'
import { NutritionNotice } from '@/components/NutritionNotice'
import CircularProgress from '@/components/CircularProgress'
import { BicepsFlexed, Hamburger } from 'lucide-react'
import { useStatsStore } from './store/useStatsStore'
import { devLog } from '@/lib/logger'
import { ConfirmDialogWithTrigger } from '@/components/ConfirmDialog'
import AccountSetupNotice from '@/components/AccountSetupNotice'
import Hero from '@/components/Hero'
import Link from 'next/link'
import MealTablesSection from '@/components/MealTablesSection'

const title = 'Track what you ate today!'
const description = (
  <>
    Type in the food you ate and the amount for each. We use the
    <span className="text-primary font-medium"> Gemma-2 model </span> — a powerful AI from Google
    DeepMind — running on Groq&apos;s LPU hardware to instantly calculate the calories and protein
    for your meal.
  </>
)

export default function Home() {
  const scrollIntoTargetsRef = React.useRef(null)

  return (
    <DaisyThemeWrapper className="flex flex-col items-center space-y-6 p-6">
      {/* Hero Section */}
      <Hero title={title} description={description}>
        <StartFreshSection />
        <p className="text-muted-foreground hover:text-accent text-xs">
          <Link href="/setup" className="hover:underline">
            Go to profile
          </Link>
        </p>
      </Hero>

      {/* Radial Progress Section */}
      <TargetsSection ref={scrollIntoTargetsRef} />

      {/* Nutrition Notice SEction */}
      <NutritionNotice />

      {/* Meal Tables Section */}
      <MealTablesSection />

      {/* Calculate Nutrition Section */}
      <CalculateNutrition ref={scrollIntoTargetsRef} />
    </DaisyThemeWrapper>
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
    <section>
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
    </section>
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
