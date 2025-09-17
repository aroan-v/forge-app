import { Loader } from 'lucide-react'
import React from 'react'

export default function Spinner({ size = 32, color = 'text-white-500', className = '' }) {
  return (
    <div className={`my-auto ${className}`} aria-label="Loading..." role="status">
      <Loader size={size} className={`animate-spin ${color}`} weight="bold" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
