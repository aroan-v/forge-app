import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'
const buttonVariants = cva(
  // Base styles shared across all buttons
  "inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default: 'bg-muted text-muted-foreground shadow-xs hover:bg-muted/90',

        destructive: cn(
          'bg-destructive text-destructive-foreground shadow-sm',
          'hover:bg-destructive/80 active:bg-destructive/60',
          'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-destructive/40 dark:focus-visible:ring-destructive/50',
          'disabled:opacity-50 disabled:pointer-events-none'
        ),

        outline:
          'border border-border bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',

        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',

        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',

        link: 'text-primary underline-offset-4 hover:underline',

        gradient: cn(
          // Layout & spacing
          'relative inline-flex items-center justify-center rounded-xl px-6 py-3',

          // Typography
          'font-semibold text-white',

          // Background (direct gradient)
          'bg-gradient-to-r from-accent to-neutral',

          // Base effects
          'shadow-md transition-all',

          // Hover effects
          'hover:scale-102 hover:shadow-lg',

          // Active effects
          'active:scale-95',

          // Disabled state
          'disabled:cursor-not-allowed disabled:opacity-50'
        ),
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        stretch: 'px-4 py-2 has-[>svg]:px-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

const MotionButton = motion(Button)

export { Button, buttonVariants, MotionButton }
