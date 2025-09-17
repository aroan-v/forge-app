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
  percent,
  hasUserComputedStats,
  color,
  value = 0,
  secondValue,
  icon: Icon,
  label,
  unit,
}) {
  const [progress, setProgress] = React.useState(0)
  const variant = colorVariants[color] || colorVariants.default

  React.useEffect(() => {
    // Animate from 0 → target value
    const animation = setTimeout(() => setProgress(percent), 500)
    return () => clearTimeout(animation)
  }, [value, percent])

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
          pathColor: hasUserComputedStats
            ? `rgba(var(--${color}-rgb), 0.2)` // 20% opacity
            : `var(--${color})`,
          trailColor: 'var(--color-base-200)',
        })}
        value={progress}
      >
        {Icon && <Icon size={32} />}
        {label && <div className="text-foreground/60 text-sm font-normal">{label}</div>}

        {secondValue && !hasUserComputedStats ? (
          <>
            <div className="text-base font-bold">
              <CountUp start={0} end={value} duration={2} /> {unit}
            </div>

            <div className="text-foreground/40 text-center text-sm font-medium">
              -- <br />
              <CountUp start={0} end={secondValue} duration={2} /> {unit} left
            </div>
          </>
        ) : (
          <div className="text-foreground text-base font-bold">
            <CountUp start={0} end={value} duration={2} /> {unit}
          </div>
        )}
      </CircularProgressbarWithChildren>
    </div>
  )
}

export default React.memo(CircularProgress)
