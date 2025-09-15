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
    const savedStats = localStorage.getItem('userStats')

    if (savedStats) {
      setShallowState({ userComputedStats: JSON.parse(savedStats) })
    }

    const groupsById = localStorage.getItem('groupsById')
    const mealsById = localStorage.getItem('mealsById')

    devLog('groupsById', groupsById)
    devLog('mealsById', mealsById)

    if (groupsById && mealsById) {
      hydrate({
        groupsById: JSON.parse(groupsById),
        mealsById: JSON.parse(mealsById),
      })
    } else {
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
