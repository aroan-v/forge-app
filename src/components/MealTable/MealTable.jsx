'use client'
import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '../ui/input'
import { CircleX, Trash } from 'lucide-react'
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

export default function MealTable({ mealName = 'Breakfast', meals, groupId }) {
  // Declare the initial meals to the local state
  const [rows, setRows] = useState(meals)
  const [deleteMode, setDeleteMode] = useState(false)

  const addMealRow = useFoodStore((s) => s.addMealRow)

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

  const totalCalories = meals?.reduce((sum, row) => sum + Number(row.calories ?? 0), 0) ?? 0
  const totalProtein = meals?.reduce((sum, row) => sum + Number(row.protein ?? 0), 0) ?? 0

  const tableCellClassNames =
    'border-input bg-background text-foreground focus:ring-primary/50 w-full rounded-md border px-2 py-1 text-center text-sm focus:ring-2 focus:outline-none'

  return (
    <div className="bg-base-200 w-full overflow-scroll rounded-md p-4">
      <h2 className="mb-2 text-lg font-semibold">{mealName}</h2>
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            {deleteMode && <TableHead className="w-[30px]"></TableHead>}
            <TableHead className="w-[150px]">Food</TableHead>
            <TableHead className="w-[100px]">Amount</TableHead>
            <TableHead className="text-primary w-[75px] text-center">Calories</TableHead>
            <TableHead className="text-accent w-[75px] text-center">Protein</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <GroupedTableRows
            group={meals}
            selectItems={[...UNITS.weight, ...UNITS.quantity]}
            groupId={groupId}
            deleteMode={deleteMode}
            setDeleteMode={setDeleteMode}
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
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-start gap-2">
        <Button onClick={() => addMealRow(groupId)} size="sm" variant="defaultOutline">
          Add Row
        </Button>
        <Button
          onClick={() => setDeleteMode((p) => !p)}
          size="sm"
          variant={deleteMode ? 'destructive' : 'destructiveOutline'}
        >
          Delete Row
        </Button>
      </div>
    </div>
  )
}

function GroupedTableRows({
  setDeleteMode,
  deleteMode,
  group,
  unit,
  selectItems,
  handleChange,
  groupId,
}) {
  const updateLoggedFoodName = useFoodStore((s) => s.updateLoggedFoodName)
  const updateLoggedFoodAmount = useFoodStore((s) => s.updateLoggedFoodAmount)
  const deleteMealRow = useFoodStore((s) => s.deleteMealRow)

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

  function handleDeleteOnce({ groupId, foodId }) {
    setDeleteMode(false)
    deleteMealRow({ groupId, foodId })
  }

  return (
    <>
      {group?.map((row, index) => (
        <TableRow key={row.id} className="hover:bg-accent/10">
          {deleteMode && (
            <TableCell>
              <button onClick={() => handleDeleteOnce({ groupId, foodId: row.id })}>
                <CircleX className="text-destructive/50 hover:text-destructive h-6 w-6 cursor-pointer transition active:scale-90" />
              </button>
            </TableCell>
          )}
          <TableCell>
            <Input
              disabled={deleteMode}
              type="text"
              value={row.food ?? ''}
              onChange={(e) =>
                updateLoggedFoodName({ groupId, foodId: row.id, foodName: e.target.value })
              }
              placeholder="Food"
              className="text-center"
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
                  updateLoggedFoodAmount({ groupId, foodId: row.id, displayValue: e.target.value })
                }
                onBlur={(e) => checkUnit({ groupId, foodId: row.id, displayValue: e.target.value })}
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
        </TableRow>
      ))}
    </>
  )
}
