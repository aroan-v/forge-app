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

  React.useEffect(() => {
    // Effect 1: restore user stats

    const userStatsString = localStorage.getItem('userStats')
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

    // Effect 2: restore groups & meals
    const groupsByIdString = localStorage.getItem('groupsById')
    const mealsByIdString = localStorage.getItem('mealsById')

    let groupsById = null
    let mealsById = null

    if (groupsByIdString) {
      try {
        groupsById = JSON.parse(groupsByIdString)
      } catch (error) {
        console.error('Failed to parse groupsById from localStorage:', error)
      }
    }

    if (mealsByIdString) {
      try {
        mealsById = JSON.parse(mealsByIdString)
      } catch (error) {
        console.error('Failed to parse mealsById from localStorage:', error)
      }
    }

    if (
      groupsById &&
      Object.keys(groupsById).length > 0 &&
      mealsById &&
      Object.keys(mealsById).length > 0
    ) {
      hydrate({ groupsById, mealsById })
    } else {
      devLog('adding food group')
      addFoodGroup()
    }

    setShallowState({ isLoading: false })
  }, [hydrate, addFoodGroup, setShallowState])

  // Effect 3: reset user stats in local storage
  React.useEffect(() => {
    if (resetStatsSignal > 0) {
      localStorage.setItem('userStats', JSON.stringify({}))
    }
  }, [resetStatsSignal])

  // Effect 3: reset meal stats in local storage
  React.useEffect(() => {
    if (resetSignal > 0) {
      localStorage.setItem('mealsById', JSON.stringify({}))
      localStorage.setItem('groupsById', JSON.stringify({}))
    }
  }, [resetSignal])

  return <>{children}</>
}

export default ClientProvider
