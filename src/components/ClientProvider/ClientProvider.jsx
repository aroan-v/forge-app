'use client'
import React from 'react'
import { useStatsStore } from '@/app/store/useStatsStore'

function ClientProvider({ children }) {
  const setShallowState = useStatsStore((s) => s.setShallowState)

  React.useEffect(() => {
    const savedStats = localStorage.getItem('userStats')

    if (savedStats) {
      setShallowState({ userComputedStats: JSON.parse(savedStats) })
    }

    setShallowState({
      isLoading: false,
    })
  }, [setShallowState])

  return <>{children}</>
}

export default ClientProvider
