import React from 'react'
import { useFoodStoreVersionTwo } from '@/app/store/useFoodStore'
import { Button } from '../ui/button'
import MealTable from '../MealTable'
import { devLog } from '@/lib/logger'
import { SquarePlus } from 'lucide-react'

function MealTablesSection() {
  const foodGroups = useFoodStoreVersionTwo((s) => s.foodGroups)
  const addFoodGroup = useFoodStoreVersionTwo((s) => s.addFoodGroup)
  devLog('foodGroups', foodGroups)

  return (
    <section className="w-full max-w-xl space-y-6">
      {foodGroups.map((id) => (
        <MealTable key={id} groupId={id} />
      ))}

      <Button size="stretch" variant="defaultOutline" onClick={addFoodGroup}>
        <SquarePlus />
        Add Food Group
      </Button>
    </section>
  )
}

export default MealTablesSection
