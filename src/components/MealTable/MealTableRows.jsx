import React from 'react'
import { useFoodStore } from '@/app/store/useFoodStore'
import { AnimatePresence } from 'framer-motion'
import { MotionTableRow, TableCell } from '../ui/table'
import { cn } from '@/lib/utils'
import { Textarea } from '../ui/textarea'

function MealTableRows({
  setDeleteMode,
  deleteMode,
  group,
  unit,
  selectItems,
  deleteIds,
  handleChange,
  toggleDeleteId,
  groupId,
}) {
  const updateLoggedFoodName = useFoodStore((s) => s.updateLoggedFoodName)
  const updateLoggedFoodAmount = useFoodStore((s) => s.updateLoggedFoodAmount)

  function checkUnit({ groupId, foodId, displayValue }) {
    let checkedDisplayValue = displayValue

    if (displayValue !== undefined) {
      const trimmed = displayValue.trim()

      // ✅ Check if it's just a number (integer or float)
      if (/^\d+(\.\d+)?$/.test(trimmed)) {
        checkedDisplayValue = `${trimmed}g`
      } else {
        // ✅ Otherwise keep whatever the user typed (like "1 cup")
        checkedDisplayValue = trimmed
      }
    }

    updateLoggedFoodAmount({ groupId, foodId, displayValue: checkedDisplayValue })
  }

  return (
    <>
      <AnimatePresence>
        {group?.map((row, index) => (
          <MotionTableRow
            motionId={row.id}
            key={row.id}
            className={cn(index % 2 === 0 ? 'bg-base-100/20' : '')}
          >
            {deleteMode && (
              <TableCell>
                <input
                  type="checkbox"
                  checked={deleteIds.includes(row.id)}
                  onChange={(e) => toggleDeleteId(row.id, e.target.checked)}
                  className="border-destructive ds-checkbox ds-checkbox-xs ds-checkbox-error border"
                />
              </TableCell>
            )}
            <TableCell>
              <div
                className={cn('text-area-bg', {
                  disabled: deleteMode || row.calories != null || row.protein != null,
                })}
              >
                <Textarea
                  disabled={deleteMode || row.calories != null || row.protein != null}
                  value={row.food ?? ''} // current food name value
                  onChange={(e) =>
                    updateLoggedFoodName({ groupId, foodId: row.id, foodName: e.target.value })
                  }
                  placeholder="Food"
                  className="resize-none" // centers text & removes resize handle
                />
              </div>
            </TableCell>
            <TableCell>
              <div
                className={cn('text-area-bg', {
                  disabled: deleteMode || row.calories != null || row.protein != null,
                })}
              >
                <Textarea
                  disabled={deleteMode || row.calories != null || row.protein != null}
                  value={row.displayValue ?? ''} // current food name value
                  onChange={(e) =>
                    updateLoggedFoodAmount({
                      groupId,
                      foodId: row.id,
                      displayValue: e.target.value,
                    })
                  }
                  onBlur={(e) =>
                    checkUnit({ groupId, foodId: row.id, displayValue: e.target.value })
                  }
                  placeholder="0"
                  className="resize-none text-center" // centers text & removes resize handle
                />
              </div>
            </TableCell>
            <TableCell className="text-primary max-w-[50px] text-center leading-tight">
              {row.calories ?? '-'}
              <br />
              <span className="text-muted-foreground/40 text-xs">kcal</span>
            </TableCell>
            <TableCell className="text-accent text-center leading-tight">
              {row.protein ?? '-'}
              <br />
              <span className="text-muted-foreground/40 text-xs">grams</span>
            </TableCell>
          </MotionTableRow>
        ))}
      </AnimatePresence>
    </>
  )
}

export default React.memo(MealTableRows)
