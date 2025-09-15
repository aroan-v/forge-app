'use client'
import React from 'react'
import { useStatsStore } from '@/app/store/useStatsStore'
import { useFoodStoreVersionTwo } from '@/app/store/useFoodStore'
import { devLog } from '@/lib/logger'

function ClientProvider({ children }) {
  const setShallowState = useStatsStore((s) => s.setShallowState)
  const hydrate = useFoodStoreVersionTwo((s) => s.hydrate)
  const addFoodGroup = useFoodStoreVersionTwo((s) => s.addFoodGroup)
  const resetSignal = useFoodStoreVersionTwo((s) => s.resetSignal)

  React.useEffect(() => {
    const savedPersonalStats = localStorage.getItem('userStats')

    devLog('savedStats', savedPersonalStats)

    if (savedPersonalStats) {
      setShallowState({ userComputedStats: JSON.parse(savedPersonalStats) })
    }

    const groupsById = JSON.parse(localStorage.getItem('groupsById'))
    const mealsById = JSON.parse(localStorage.getItem('mealsById'))

    devLog('groupsById', groupsById)
    devLog('mealsById', mealsById)

    if (
      groupsById &&
      Object.keys(groupsById).length > 0 &&
      mealsById &&
      Object.keys(mealsById).length > 0
    ) {
      hydrate({ groupsById, mealsById })
    } else {
      devLog('keys not found - initializing')
      addFoodGroup()
    }

    setShallowState({
      isLoading: false,
    })
  }, [setShallowState, addFoodGroup, hydrate])

  React.useEffect(() => {
    if (resetSignal > 0) {
      localStorage.setItem('mealsById', JSON.stringify({}))
      localStorage.setItem('groupsById', JSON.stringify({}))
    }
  }, [resetSignal])

  return <>{children}</>
}

export default ClientProvider
