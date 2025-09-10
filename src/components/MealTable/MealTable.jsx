'use client'
import { useState, useRef, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  MotionTableRow,
  MotionTableBody,
  MotionTable,
  MotionTableHeader,
} from '@/components/ui/table'
import { Button, MotionButton } from '@/components/ui/button'
import { Input } from '../ui/input'
import { CircleX, SquarePen, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { motionTransition } from '@/constants/constants'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import SettingsAction from '../SettingsAction'
import { UNITS, UNIT_TYPES, sampleData, templateData } from '@/app/schemas/foodSchema'
import { useFoodStore } from '@/app/store/useFoodStore'
import { Textarea } from '../ui/textarea'
import { cn } from '@/lib/utils'

export default function MealTable({ mealName = 'Breakfast', meals, groupId }) {
  // Declare the initial meals to the local state
  const [rows, setRows] = useState(meals)
  const [deleteMode, setDeleteMode] = useState(false)
  const [deleteIds, setDeleteIds] = useState([])
  const addMealRow = useFoodStore((s) => s.addMealRow)
  const deleteMealRow = useFoodStore((s) => s.deleteMealRow)
  const updateGroupName = useFoodStore((s) => s.updateGroupName)

  const [localMealName, setLocalMealName] = useState(mealName)
  const [isEditingHeader, setIsEditingHeader] = useState(false)

  const handleToggle = () => {
    if (isEditingHeader) {
      // save logic can go here if needed
      console.log('Saved:', localMealName)
      updateGroupName({ groupId, groupName: localMealName })
    }
    setIsEditingHeader(!isEditingHeader)
  }

  const deleteFoodGroup = useFoodStore((s) => s.deleteFoodGroup)

  const inputRef = useRef(null)
  useEffect(() => {
    if (isEditingHeader && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select() // optional: select text for easier editing
      }, 500) // 50-100ms usually works
    }
  }, [isEditingHeader])

  function toggleDeleteId(rowId, checked) {
    setDeleteIds((prev) => (checked ? [...prev, rowId] : prev.filter((id) => id !== rowId)))
  }

  // Handle input changes for local states
  const handleChange = ({ foodId, field, value }) => {
    setRows((prev) =>
      prev.map((food) => {
        if (food.id !== foodId) {
          return food
        }
        const updatedFood = { ...food }
        updatedFood[field] = value
        return updatedFood
      })
    )
  }

  // ✅ Reduce and round to nearest 0.1
  const totalCalories =
    Math.round((meals?.reduce((sum, row) => sum + Number(row.calories ?? 0), 0) ?? 0) * 10) / 10

  const totalProtein =
    Math.round((meals?.reduce((sum, row) => sum + Number(row.protein ?? 0), 0) ?? 0) * 10) / 10

  const tableCellClassNames =
    'border-input bg-background text-foreground focus:ring-primary/50 w-full rounded-md border px-2 py-1 text-center text-sm focus:ring-2 focus:outline-none'

  return (
    <motion.div
      animate={{ height: 'auto' }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      layout
      className="bg-base-200 relative w-full max-w-xl overflow-scroll rounded-md p-4"
    >
      <motion.div layout className="absolute top-6 right-2 -translate-y-1/2">
        <SettingsAction
          onEdit={() => setIsEditingHeader(true)}
          onDelete={() => deleteFoodGroup(groupId)}
        />
      </motion.div>
      <motion.div layout="size" className="mb-2 flex w-[95%] gap-4 p-2 align-middle">
        <Input
          value={localMealName ?? ''}
          placeholder="Food Group"
          onChange={(e) => setLocalMealName(e.target.value)}
          onBlur={() => setIsEditingHeader(false)}
          ref={inputRef}
          disabled={!isEditingHeader}
          className={`custom-ds-input flex-1 text-lg font-semibold ${!localMealName && 'italic'}`}
        />

        {/* {isEditingHeader && (
          <Button variant="defaultOutline" size="stretch" onClick={handleToggle}>
            Save
          </Button>
        )} */}

        <AnimatePresence mode="wait">
          {isEditingHeader && (
            <MotionButton
              key="save-btn"
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={motionTransition}
              variant="defaultOutline"
              size="stretch"
              onClick={handleToggle}
            >
              Save
            </MotionButton>
          )}
        </AnimatePresence>
      </motion.div>
      <MotionTable className="w-full table-fixed">
        <MotionTableHeader>
          <MotionTableRow>
            {deleteMode && (
              <TableHead className="text-destructive/80 w-[30px]">
                <Trash2 size={16} />
              </TableHead>
            )}
            <TableHead className="w-[150px]">Food</TableHead>
            <TableHead className="w-[100px]">Amount</TableHead>
            <TableHead className="text-primary w-[75px] text-center">Calories</TableHead>
            <TableHead className="text-accent w-[75px] text-center">Protein</TableHead>
          </MotionTableRow>
        </MotionTableHeader>

        <TableBody>
          <GroupedTableRows
            group={meals}
            selectItems={[...UNITS.weight, ...UNITS.quantity]}
            groupId={groupId}
            deleteMode={deleteMode}
            setDeleteMode={setDeleteMode}
            deleteIds={deleteIds}
            toggleDeleteId={toggleDeleteId}
          />

          {/* ✅ Running total row */}
          <MotionTableRow className="bg-muted/20 font-semibold">
            <TableCell></TableCell>
            {deleteMode && <TableCell></TableCell>}
            <TableCell className="text-center"></TableCell>
            <TableCell className="text-center">
              <span className="text-primary">{totalCalories}kcal</span>
            </TableCell>
            <TableCell className="text-center">
              <span className="text-accent">{totalProtein}g</span>
            </TableCell>
          </MotionTableRow>
        </TableBody>
      </MotionTable>

      <div className="mt-4 flex justify-center gap-2">
        {deleteMode ? (
          <>
            <Button
              disabled={deleteIds.length === 0}
              variant="destructiveOutline"
              size="sm"
              onClick={() => {
                setTimeout(() => setDeleteMode(false), 1000)
                setDeleteIds([])
                deleteMealRow({ groupId, foodIds: deleteIds })
              }}
            >
              <Trash2 /> Delete
            </Button>
            <Button size="sm" variant="defaultOutline" onClick={() => setDeleteMode(false)}>
              Cancel Delete Rows
            </Button>
          </>
        ) : (
          <>
            <Button
              disabled={meals.length >= 10}
              onClick={() => addMealRow(groupId)}
              size="sm"
              variant="defaultOutline"
            >
              Add Row
            </Button>
            <Button
              disabled={meals.length <= 1}
              onClick={() => setDeleteMode(true)}
              size="sm"
              variant="destructiveOutline"
            >
              Delete Row
            </Button>
          </>
        )}
      </div>
    </motion.div>
  )
}

function GroupedTableRows({
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
                  disabled: deleteMode || row.calories || row.protein,
                })}
              >
                <Textarea
                  disabled={deleteMode || row.calories || row.protein}
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
                  disabled: deleteMode || row.calories || row.protein,
                })}
              >
                <Textarea
                  disabled={deleteMode || row.calories || row.protein}
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
