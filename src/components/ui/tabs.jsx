'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'

function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('flex flex-col items-center gap-2', className)}
      {...props}
    />
  )
}

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]',
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Typography
        'text-foreground',
        'dark:text-muted-foreground',
        'text-sm',
        'font-medium',
        'whitespace-nowrap',

        // Layout / Flex
        'inline-flex',
        'flex-1',
        'h-[calc(100%-1px)]',
        'items-center',
        'justify-center',
        'gap-1.5',
        'rounded-md',

        // Spacing
        'px-2',
        'py-1',

        // Border / Shadow
        'border',
        'border-transparent',

        // Focus / Ring
        'focus-visible:outline-ring',
        'focus-visible:outline-1',
        'focus-visible:ring-ring/50',
        'focus-visible:ring-[3px]',

        // Transition
        'transition-[color,box-shadow]',

        // Disabled
        'disabled:pointer-events-none',
        'disabled:opacity-50',

        // SVG handling
        '[&_svg]:pointer-events-none',
        '[&_svg]:shrink-0',
        "[&_svg:not([class*='size-'])]:size-4",

        // Active state styles
        'data-[state=active]:bg-primary/50',
        'dark:data-[state=active]:bg-primary/50',
        'data-[state=active]:shadow-sm',
        'dark:data-[state=active]:text-foreground',
        'dark:data-[state=active]:border-primary',

        // Merge any extra classes
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex w-full flex-1 justify-center border outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
