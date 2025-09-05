import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, disableFocus = true, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'ds-input',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  )
}

export { Input }
