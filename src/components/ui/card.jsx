import * as React from 'react'

import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import { Button } from './button'

const cardVariants = cva(
  // Base styles shared across all cards
  'bg-base-200 border-base-300 rounded-box border shadow transition-all',
  {
    variants: {
      variant: {
        default: 'shadow-sm',
        elevated: 'bg-card border-border shadow-md hover:shadow-lg',
        outline: 'border-2 border-dashed border-muted-foreground/30 bg-background',
        ghost: 'bg-transparent border-none shadow-none',
      },
      size: {
        default: 'p-6',
        sm: 'p-4 text-sm',
        lg: 'p-8 text-base',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-lg hover:border-accent/50',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
    },
  }
)

function Card({ className, variant, size, interactive, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, size, interactive, className }))}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

function CardSample() {
  return (
    <Card className="w-[350px] shadow-md">
      {/* Header */}
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a short description of what this card is about.</CardDescription>
      </CardHeader>

      {/* Main content */}
      <CardContent className="space-y-2">
        <p className="text-muted-foreground text-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed ultricies
          felis eget nunc pretium, nec fringilla neque feugiat.
        </p>
        <p className="text-muted-foreground text-sm">
          Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis
          egestas.
        </p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </CardFooter>
    </Card>
  )
}

export {
  CardSample,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
