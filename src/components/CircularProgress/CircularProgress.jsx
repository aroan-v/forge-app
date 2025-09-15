import { cn } from '@/lib/utils'
import React from 'react'
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import CountUp from 'react-countup'

function CircularProgress({
  percent,
  color = 'primary',
  value = 0,
  secondValue,
  icon: Icon,
  label,
  unit,
}) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    // Animate from 0 → target value
    const animation = setTimeout(() => setProgress(percent), 500)
    return () => clearTimeout(animation)
  }, [value, percent])

  return (
    <div
      className={cn(
        `text-${color} bg-${color}/10`,
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

        {secondValue ? (
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
