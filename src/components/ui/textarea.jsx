import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // Base classes
        'w-full',

        // Sizing and Spacing
        // 'h-auto min-h-[1.2em] resize-none overflow-auto px-3 py-2',
        'h-auto resize-none overflow-visible',

        // Borders and Appearance
        'rounded-md bg-transparent shadow-xs',
        'dark:bg-base-100', // This class would need custom dark mode configuration

        // Typography
        'placeholder:text-muted-foreground/30 text-center text-base leading-[1.2] md:text-sm',

        // Focus and Transition
        'transition-[color,box-shadow] outline-none',

        // Disabled state
        'disabled:cursor-not-allowed disabled:opacity-95 disabled:dark:bg-transparent',

        // Invalid state
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        'dark:aria-invalid:ring-destructive/40',

        className
      )}
      {...props}
    />
  )
}

export { Textarea }
