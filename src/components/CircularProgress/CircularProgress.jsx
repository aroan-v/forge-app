import { devLog } from '@/lib/logger'
import { cn } from '@/lib/utils'
import React from 'react'
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import CountUp from 'react-countup'

const colorVariants = {
  primary: {
    bg: 'bg-primary/20',
    text: 'text-primary',
  },
  secondary: {
    bg: 'bg-secondary/20',
    text: 'text-secondary',
  },
  destructive: {
    bg: 'bg-destructive/20',
    text: 'text-destructive',
  },
  default: {
    bg: 'bg-neutral/20',
    text: 'text-neutral',
  },
}

function CircularProgress({
  totalValue, // totalCalories
  target, // calorieGoal
  percent,
  overValue, // how much over
  remainingValue, // how much left
  isOverTarget, // boolean
  color,
  icon: Icon,
  hasUserComputedStats,
  label,
  unit,
}) {
  const [progress, setProgress] = React.useState(0)
  const variant = colorVariants[color] || colorVariants.default

  devLog('totalValue', totalValue)
  devLog('remainingValue', remainingValue)
  devLog('hasUserComputedStats', hasUserComputedStats)
  devLog('color', color)
  devLog('variant', variant)
  devLog('percent', percent)
  devLog('progress', progress)

  React.useEffect(() => {
    // Animate from 0 → target value
    const animation = setTimeout(() => setProgress(percent), 500)
    return () => clearTimeout(animation)
  }, [totalValue, percent])

  return (
    <div
      className={cn(
        variant.text,
        variant.bg,
        'mt-6 inline-flex flex-col items-center rounded-full text-xl leading-tight font-bold'
      )}
    >
      <CircularProgressbarWithChildren
        strokeWidth={5}
        styles={buildStyles({
          pathColor: `var(--${color})`,
          trailColor: 'var(--color-base-200)',
        })}
        value={progress}
      >
        {Icon && <Icon size={32} />}
        {label && <div className="text-foreground/60 text-sm font-normal">{label}</div>}

        <div className="text-center text-base font-bold">
          <CountUp start={0} end={totalValue} duration={2} /> {unit}
        </div>

        {remainingValue > 0 && hasUserComputedStats && (
          <div className="text-foreground/40 text-center text-xs font-medium">
            <CountUp start={0} end={remainingValue} duration={2} /> {unit} left
          </div>
        )}

        {overValue > 0 && hasUserComputedStats && (
          <div className="text-foreground/40 text-center text-xs font-medium">
            over by <CountUp start={0} end={overValue} duration={2} /> {unit}!
          </div>
        )}
      </CircularProgressbarWithChildren>
    </div>
  )
}

export default React.memo(CircularProgress)
