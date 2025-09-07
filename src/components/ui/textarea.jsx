import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base classes and custom component name
        'text-area-custom text-center',
        'flex w-full',

        // Sizing and layout
        'field-sizing-content px-3 py-2',

        // Borders, background, and shadows
        'rounded-md bg-transparent shadow-xs',

        // Typography
        'placeholder:text-muted-foreground/30 text-base md:text-sm',

        // Focus and transitions
        'transition-[color,box-shadow] outline-none',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',

        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-50',

        // Invalid state
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        'dark:aria-invalid:ring-destructive/40',

        // Dark mode specific styles
        'dark:bg-base-100',

        className
      )}
      {...props}
    />
  )
}

export { Textarea }
