'use client'
import DaisyThemeWrapper from '@/components/DaisyThemeWrapper'
import MacroSetupForm from '@/components/MacroSetupForm'
import { useStatsStore } from '../store/useStatsStore'
import Spinner from '@/components/Spinner'
import Hero from '@/components/Hero'
import { devLog } from '@/lib/logger'
import UserStats from '@/components/UserStats'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'

const content = {
  initial: {
    title: (
      <>
        Your Personalized Nutrition <br /> Starts Here
      </>
    ),
    description:
      'Tell us a bit about yourself—your height, weight, age, and activity level—and we’ll calculate the perfect protein and calorie targets to fuel your day.',
  },
  results: {
    title: (name) => `Hello, ${name || 'Guest'}!`,
    description:
      'Based on your profile, here are your personalized targets for calories and protein. Use these numbers as a guide to reach your goals.',
  },
}
export default function SetupPage() {
  const isLoading = useStatsStore((s) => s.isLoading)
  const userComputedStats = useStatsStore((state) => state.userComputedStats)
  const scrollToTargetRef = React.useRef(null)

  const title = userComputedStats
    ? content.results.title(userComputedStats.name)
    : content.initial.title

  const description = userComputedStats ? content.results.description : content.initial.description

  devLog('userComputedStats', userComputedStats)

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center">
        <Spinner />
      </div>
    )
  }

  devLog('scrollToTargetRef', scrollToTargetRef)

  return (
    <DaisyThemeWrapper className="flex flex-col items-center space-y-6 p-6">
      <Hero
        targetRef={scrollToTargetRef}
        title={title}
        color="secondary"
        isBig={!!userComputedStats}
        description={description}
      >
        <Link href="/">
          {userComputedStats ? (
            <Button size="lg" variant="gradient">
              Start tracking!
            </Button>
          ) : (
            <Button size="sm" variant="secondaryOutline">
              Start tracking instead
            </Button>
          )}
        </Link>
      </Hero>
      {/* {!isLoading && <MacroSetupForm userComputedStats={userComputedStats} />} */}

      {userComputedStats ? (
        <UserStats stats={userComputedStats} />
      ) : (
        <MacroSetupForm scrollToTargetRef={scrollToTargetRef} />
      )}
    </DaisyThemeWrapper>
  )
}

function LoadingDots() {
  return <span className="ds-loading ds-loading-dots ds-loading-xl"></span>
}
