'use client'
import { useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import { CircleX, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UNITS, UNIT_TYPES, sampleData, templateData } from '@/app/schemas/foodSchema'
import { useFoodStore } from '@/app/store/useFoodStore'
import { Textarea } from '../ui/textarea'

export default function MealTable({ mealName = 'Breakfast', meals, groupId }) {
  // Declare the initial meals to the local state
  const [rows, setRows] = useState(meals)
  const [deleteMode, setDeleteMode] = useState(false)
  const [deleteIds, setDeleteIds] = useState([])
  const addMealRow = useFoodStore((s) => s.addMealRow)
  const deleteMealRow = useFoodStore((s) => s.deleteMealRow)

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
      layout="size"
      className="bg-base-200 w-full overflow-scroll rounded-md p-4"
    >
      <motion.h2 layout className="mb-2 text-lg font-semibold">
        {mealName}
      </motion.h2>
      <MotionTable className="w-full table-fixed">
        <MotionTableHeader>
          <MotionTableRow>
            {deleteMode && <TableHead className="w-[30px]"></TableHead>}
            <TableHead className="w-[150px]">Food</TableHead>
            <TableHead className="w-[100px]">Amount</TableHead>
            <TableHead className="text-primary w-[75px] text-center">Calories</TableHead>
            <TableHead className="text-accent w-[75px] text-center">Protein</TableHead>
          </MotionTableRow>
        </MotionTableHeader>
        <MotionTableBody>
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
          <TableRow className="bg-muted/20 font-semibold">
            <TableCell></TableCell>
            {deleteMode && <TableCell></TableCell>}
            <TableCell className="text-center"></TableCell>
            <TableCell className="text-center">
              <span className="text-primary">{totalCalories}kcal</span>
            </TableCell>
            <TableCell className="text-center">
              <span className="text-accent">{totalProtein}g</span>
            </TableCell>
          </TableRow>
        </MotionTableBody>
      </MotionTable>

      <motion.div layout className="mt-4 flex justify-center gap-2">
        {deleteMode ? (
          <Button
            variant="destructiveOutline"
            size="sm"
            onClick={() => {
              setDeleteMode(false)
              deleteMealRow({ groupId, foodIds: deleteIds })
            }}
          >
            <Trash2 color="#d11f1f" />
          </Button>
        ) : (
          <>
            <Button onClick={() => addMealRow(groupId)} size="sm" variant="defaultOutline">
              Add Row
            </Button>
            <Button onClick={() => setDeleteMode((p) => !p)} size="sm" variant="destructiveOutline">
              Delete Row
            </Button>
          </>
        )}
      </motion.div>
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
      <AnimatePresence mode="popLayout">
        {group?.map((row, index) => (
          <MotionTableRow motionId={row.id} key={row.id} className="hover:bg-accent/10">
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
              {/* <Input
                disabled={deleteMode}
                type="text"
                value={row.food ?? ''}
                onChange={(e) =>
                  updateLoggedFoodName({ groupId, foodId: row.id, foodName: e.target.value })
                }
                placeholder="Food"
                className="text-center"
              /> */}

              <Textarea
                disabled={deleteMode} // disables editing when delete mode is active
                value={row.food ?? ''} // current food name value
                onChange={(e) =>
                  updateLoggedFoodName({ groupId, foodId: row.id, foodName: e.target.value })
                }
                placeholder="Food"
                className="resize-none" // centers text & removes resize handle
              />
            </TableCell>
            <TableCell>
              <div className="custom-container">
                <Input
                  disabled={deleteMode}
                  type="text"
                  value={row.displayValue ?? ''}
                  disableFocus={true}
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
                  className="text-center"
                />
              </div>
            </TableCell>
            {/* ✅ Combined Calories + Protein */}
            {/* <TableCell className="text-right">
            <span className="text-primary">{row.calories} kcal</span>
            <span className="text-muted-foreground mx-1">|</span>
            <span className="text-accent">{row.protein}g</span>
          </TableCell> */}
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
