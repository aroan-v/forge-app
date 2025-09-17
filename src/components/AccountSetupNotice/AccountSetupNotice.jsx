import React from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { useStatsStore } from '@/app/store/useStatsStore'
import { Button } from '../ui/button'
import Link from 'next/link'

function AccountSetupNotice() {
  const userComputedStats = useStatsStore((s) => s.userComputedStats)
  const isLoading = useStatsStore((s) => s.isLoading)

  if (isLoading) {
    return
  }

  if (userComputedStats) {
    return
  }

  return (
    <Alert variant="accent" className="max-w-xl">
      <Info className="h-4 w-4" />
      <div>
        <AlertTitle>{"Looks like you're new here!"}</AlertTitle>
        <AlertDescription>
          {"Let's get you set up with your daily calorie and protein goals."}
          <Link href="/setup">
            <Button size="sm" variant="accent">
              Set up now
            </Button>
          </Link>
        </AlertDescription>
      </div>
    </Alert>
  )
}

export default AccountSetupNotice
