import CountUp from 'react-countup'
import React from 'react'
import { Card, CardHeader, CardSample } from '../ui/card'
import DaisyThemeWrapper from '../DaisyThemeWrapper'
import { BicepsFlexed, Hamburger, PersonStanding } from 'lucide-react'
import { getBmiRating } from '@/lib/nutritionUtils'
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar'

import CircularProgress from '../CircularProgress'
import { cn } from '@/lib/utils'
import { ConfirmDialogWithTrigger } from '../ConfirmDialog'
import { useStatsStore } from '@/app/store/useStatsStore'
import { Button } from '../ui/button'

export default function UserStats({ stats }) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    if (!stats) return

    // Animate from 0 to targetValue
    const animation = setTimeout(() => setProgress(100), 500) // trigger the animation

    return () => clearTimeout(animation)
  }, [stats])

  if (!stats) return null

  // Body Composition

  const bodyMassIndex = {
    label: 'BMI',
    name: 'Body Mass Index Rating',
    value: stats.bmi,
    unit: '',
    rating: getBmiRating(stats.bmi)?.label,
    color: getBmiRating(stats.bmi)?.color,
    content: 'A measure of your weight relative to height.',
  }

  const bodyCompositionItems = [
    {
      label: 'BMR',
      name: 'Basal Metabolic Rate',
      value: stats.bmr,
      unit: 'kcal',
      content: 'The calories your body burns at rest just to stay alive.',
    },
    {
      label: 'TDEE',
      name: 'Total Daily Energy Expenditure',
      value: stats.tdee,
      unit: 'kcal',
      content: 'Total calories you burn in a day including activity.',
    },
    {
      label: 'Hydration',
      name: 'Water Intake',
      value: stats.hydration,
      unit: 'ml',
      content: 'Daily water intake goal to keep your body hydrated and healthy.',
    },
  ]

  // Daily Needs
  const dailyNeedsItems = [
    {
      label: 'Calories',
      name: 'Daily Calorie Goal',
      value: stats.calorieGoal,
      unit: 'kcal',
      content: 'Your daily calorie target based on your goals and energy needs.',
    },
    {
      label: 'Protein',
      name: 'Protein Target',
      value: stats.proteinTarget,
      unit: 'g',
      content: 'Daily protein target to support muscle repair, growth, and satiety.',
    },
    {
      label: 'Fat',
      name: 'Fat Target',
      value: stats.fatTarget,
      unit: 'g',
      content: 'Daily fat target for energy, hormones, and nutrient absorption.',
    },
    {
      label: 'Carbs',
      name: 'Carbohydrate Target',
      value: stats.carbTarget,
      unit: 'g',
      content: 'Daily carbohydrate target for energy and optimal performance.',
    },
  ]

  return (
    <DaisyThemeWrapper className="flex flex-col items-center gap-4">
      <div className="flex max-w-lg justify-center gap-4 p-4">
        <CircularProgress
          color={'primary'}
          totalValue={stats.calorieGoal}
          icon={Hamburger}
          label={'Your target calories:'}
          unit={'kcal'}
        />

        <CircularProgress
          color={'secondary'}
          totalValue={stats.proteinTarget}
          icon={BicepsFlexed}
          label={'Your target protein:'}
          unit={'grams'}
        />
      </div>

      <div className="grid grid-rows-[auto_auto] items-start justify-center gap-4">
        <Card className="row-start-1 row-end-2 flex w-full items-center justify-center gap-4">
          <PersonStanding size={32} className={`${bodyMassIndex.color}`} />
          <div className="flex flex-col items-center justify-center gap-2">
            <h3 className="text-sm font-medium text-gray-500">{bodyMassIndex.name}</h3>
            <div className={`ds-badge ds-badge-soft p-4 text-lg ${bodyMassIndex.color}`}>
              {bodyMassIndex.rating}
            </div>
            <p className="text-xs leading-tight text-gray-700 italic">{bodyMassIndex.content}</p>
            {bodyMassIndex.unit && (
              <p className="text-sm font-semibold text-gray-800">{bodyMassIndex.unit}</p>
            )}
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <p className="text-xs">Score:</p>
            <CountUp
              className="text-3xl font-extrabold"
              start={0}
              end={bodyMassIndex.value}
              duration={1.5}
              separator=","
            />
          </div>
        </Card>

        <div className="row-start-2 row-end-3 flex w-full flex-wrap justify-center gap-4">
          {bodyCompositionItems?.map(({ name, label, value, unit, content }) => (
            <Card
              key={label}
              className="bg-base-200 flex max-w-40 flex-col items-center p-4 text-center shadow-md"
            >
              <Stat name={name} content={content}>
                <p className="text-info text-xl font-bold">
                  <CountUp start={0} end={value} duration={1.5} separator="," />
                  {unit && ` ${unit}`}
                </p>
              </Stat>
            </Card>
          ))}
        </div>
      </div>

      <ResetUserStats />
    </DaisyThemeWrapper>
  )
}

function Stat({ name, rating, color, content, unit, children }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {/* Label */}
      <h3 className="text-sm font-medium text-gray-500">{name}</h3>

      {children}

      {/* Description */}
      <p className="text-xs leading-tight text-gray-700 italic">{content}</p>

      {/* Optional unit */}
      {/* {unit && <p className="text-sm font-semibold text-gray-800">{unit}</p>} */}
    </div>
  )
}

function ResetUserStats() {
  const resetUserStats = useStatsStore((s) => s.resetUserStats)

  return (
    <ConfirmDialogWithTrigger
      title="Reset Saved Stats?"
      dialogDescription="This will erase all your saved stats."
      confirmationContent="Yes, reset"
      handleConfirmation={resetUserStats}
    >
      <Button variant="destructiveOutline">Reset Profile</Button>
    </ConfirmDialogWithTrigger>
  )
}
