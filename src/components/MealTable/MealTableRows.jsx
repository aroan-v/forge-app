import React from 'react'
import { useFoodStore, useFoodStoreVersionTwo } from '@/app/store/useFoodStore'
import { AnimatePresence } from 'framer-motion'
import { MotionTableRow, TableCell } from '../ui/table'
import { cn } from '@/lib/utils'
import { Textarea } from '../ui/textarea'
import { devLog } from '@/lib/logger'

const MealRow = React.memo(function MealRow({
  id,
  index,
  deleteMode,
  isChecked,
  groupId,
  handleToggleId,
}) {
  devLog('MealRowId', id)
  const updateLoggedFoodName = useFoodStore((s) => s.updateLoggedFoodName)
  const updateLoggedFoodAmount = useFoodStore((s) => s.updateLoggedFoodAmount)

  const row = useFoodStoreVersionTwo((s) => s.mealsById[id])
  devLog('mealInfo', row)

  if (!row) {
    // Guard for AnimatePresence
    return
  }

  function checkUnit({ groupId, foodId, displayValue }) {
    let checkedDisplayValue = displayValue?.trim()
    if (/^\d+(\.\d+)?$/.test(checkedDisplayValue)) {
      checkedDisplayValue = `${checkedDisplayValue}g`
    }
    updateLoggedFoodAmount({ groupId, foodId, displayValue: checkedDisplayValue })
  }

  return (
    <MotionTableRow motionId={id} className={cn(index % 2 === 0 ? 'bg-base-100/20' : '')}>
      {deleteMode && (
        <TableCell>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => handleToggleId(id)}
            className="border-destructive ds-checkbox ds-checkbox-xs ds-checkbox-error border"
          />
        </TableCell>
      )}
      <TableCell>
        <Textarea
          disabled={deleteMode || row.calories != null || row.protein != null}
          value={row.food ?? ''}
          onChange={(e) =>
            updateLoggedFoodName({ groupId, foodId: row.id, foodName: e.target.value })
          }
          placeholder="Food"
          className="resize-none"
        />
      </TableCell>
      <TableCell>
        <Textarea
          disabled={deleteMode || row.calories != null || row.protein != null}
          value={row.displayValue ?? ''}
          onChange={(e) =>
            updateLoggedFoodAmount({ groupId, foodId: row.id, displayValue: e.target.value })
          }
          onBlur={(e) => checkUnit({ groupId, foodId: row.id, displayValue: e.target.value })}
          placeholder="0"
          className="resize-none text-center"
        />
      </TableCell>
      <TableCell className="text-primary max-w-[50px] text-center leading-tight">
        {row.calories ?? '-'} <br />
        <span className="text-muted-foreground/40 text-xs">kcal</span>
      </TableCell>
      <TableCell className="text-accent text-center leading-tight">
        {row.protein ?? '-'} <br />
        <span className="text-muted-foreground/40 text-xs">grams</span>
      </TableCell>
    </MotionTableRow>
  )
})

function MealTableRows({ idsToDelete, mealIds, deleteMode, groupId, handleToggleId }) {
  devLog('MealTableRows - rendered', mealIds)

  return (
    <AnimatePresence>
      {mealIds?.map((id, i) => {
        const isChecked = idsToDelete.includes(id)
        devLog('iterating on:', id)

        return (
          <MealRow
            key={id}
            id={id}
            isChecked={isChecked}
            index={i}
            deleteMode={deleteMode}
            groupId={groupId}
            handleToggleId={handleToggleId}
          />
        )
      })}
    </AnimatePresence>
  )
}

export default MealTableRows
