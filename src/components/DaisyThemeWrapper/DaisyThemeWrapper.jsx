import React from 'react'
import { cn } from '@/lib/utils'

function DaisyThemeWrapper({ children, className = '', ...props }) {
  return (
    <div id="daisy-scope" className={cn(className)} {...props}>
      {children}
    </div>
  )
}
export default DaisyThemeWrapper
