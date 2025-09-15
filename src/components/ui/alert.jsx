import * as React from 'react'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const alertVariants = cva(
  // Base styles grouped by function
  'relative flex flex-col gap-4 items-center text-center ' + // layout
    'w-full rounded-lg px-4 py-3 text-sm ' + // sizing & spacing
    'has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] ' + // grid columns
    'gap-y-2 has-[>svg]:gap-x-3 ' + // gaps
    '[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current', // svg styling

  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        accent: 'bg-accent/10 border-1 border-accent text-white',
        destructive:
          'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Alert({ className, variant, ...props }) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }) {
  return (
    <div
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-muted-foreground flex flex-col gap-4 text-sm [&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
