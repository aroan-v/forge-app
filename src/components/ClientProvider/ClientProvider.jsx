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
  const resetStatsSignal = useStatsStore((s) => s.resetSignal)

  // Checks if the local storage already has saved userStats
  React.useEffect(() => {
    const userStatsString = localStorage.getItem('userStats')

    devLog('userStatsString', userStatsString)

    if (userStatsString) {
      try {
        const parsedUserStats = JSON.parse(userStatsString)

        if (Object.keys(parsedUserStats).length > 0) {
          setShallowState({ userComputedStats: parsedUserStats })
        }
      } catch (error) {
        console.error('Failed to parse userStats from localStorage:', error)
      }
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
    if (resetStatsSignal > 0) {
      localStorage.setItem('userStats', JSON.stringify({}))
    }
  }, [resetStatsSignal])

  React.useEffect(() => {
    if (resetSignal > 0) {
      localStorage.setItem('mealsById', JSON.stringify({}))
      localStorage.setItem('groupsById', JSON.stringify({}))
    }
  }, [resetSignal])

  return <>{children}</>
}

export default ClientProvider
