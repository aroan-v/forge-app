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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UNITS, UNIT_TYPES, sampleData } from '@/app/schemas/foodSchema'

export default function MealTable({ mealName = 'Breakfast' }) {
  const [rows, setRows] = useState(() => {
    const rows = {
      quantity: [],
      weight: [],
    }

    sampleData.forEach((meal) => {
      meal.id = Date.now().toString(36) + Math.random().toString(36).substring(2, 10)

      if (meal.unitType === 'weight') {
        rows.weight.push(meal)
      } else if (meal.unitType === 'quantity') {
        rows.quantity.push(meal)
      }
    })

    return rows
  })

  console.log('rows', rows)
  const [gender, setGender] = useState('')

  // Add a new empty row
  const addRow = () => {
    setRows([...rows, { food: '', weight: '', calories: '', protein: '' }])
  }

  const deleteRow = () => {
    setRows((prev) => prev.slice(0, prev.length - 1))
  }

  // Handle input changes
  const handleChange = ({ index, field, value, unit }) => {
    console.log('changing rows', rows)
    console.log('unit', unit)

    const updatedRows = [...rows[unit]]

    updatedRows[index] = {
      ...updatedRows[index],
      [field]: value,
    }

    setRows((prev) => {
      return {
        ...prev,
        [unit]: updatedRows,
      }
    })
  }

  const addQuantityRow = () => {}

  const combinedFood = [...rows.quantity, ...rows.weight]
  const totalCalories = combinedFood.reduce((sum, row) => sum + Number(row.calories), 0)
  const totalProtein = combinedFood.reduce((sum, row) => sum + Number(row.protein), 0)
  const quantityRows = rows.quantity
  const weightRows = rows.weight

  const tableCellClassNames =
    'border-input bg-background text-foreground focus:ring-primary/50 w-full rounded-md border px-2 py-1 text-center text-sm focus:ring-2 focus:outline-none'

  return (
    <div className="bg-base-200 overflow-x-auto rounded-md p-4">
      <h2 className="mb-2 text-lg font-semibold">{mealName}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[100px]">Food</TableHead>
            <TableHead>Weight (g)</TableHead>
            {/* ✅ Merge Calories + Protein */}
            <TableHead className="text-center">Calories / Protein</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <GroupedTableRows
            group={weightRows}
            selectItems={UNITS.weight}
            unit="weight"
            handleChange={handleChange}
          />
          <GroupedTableRows
            group={quantityRows}
            selectItems={UNITS.quantity}
            unit="quantity"
            handleChange={handleChange}
          />

          {/* ✅ Running total row */}
          <TableRow className="bg-muted/20 font-semibold">
            <TableCell></TableCell>
            <TableCell className="text-center"></TableCell>
            <TableCell className="text-right">
              <span className="text-primary">{totalCalories}kcal</span>
              <span className="text-muted-foreground mx-1">|</span>
              <span className="text-accent">{totalProtein}g</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-start gap-2">
        <Button onClick={addRow} size="sm" variant="defaultOutline">
          Add Row
        </Button>
        <Button onClick={addQuantityRow} size="sm" variant="defaultOutline">
          Add by quantity
        </Button>
        <Button onClick={deleteRow} size="sm" variant="destructiveOutline">
          Delete Row
        </Button>
      </div>
    </div>
  )
}

function GroupedTableRows({ group, unit, selectItems, handleChange }) {
  return (
    <>
      {group?.map((row, index) => (
        <TableRow key={row.id} className="hover:bg-accent/10">
          <TableCell>
            <Input
              type="text"
              value={row.food}
              onChange={(e) => handleChange({ index, field: 'food', value: e.target.value, unit })}
              placeholder="Food"
              className="text-center"
            />
          </TableCell>
          <TableCell>
            <div className="custom-container">
              <Input
                type="number"
                value={row.value}
                disableFocus={true}
                onChange={(e) =>
                  handleChange({ index, field: 'weight', value: e.target.value, unit })
                }
                placeholder="0"
                className="h-[90%] text-center shadow-none"
              />

              <Select
                className="w-full"
                defaultValue={row.unit}
                onValueChange={(value) => handleChange({ index, field: 'unit', value, unit })}
              >
                <SelectTrigger className="bg-base-200/50 border-none">
                  <SelectValue placeholder="Select unit" />
                  {/* <SelectValue placeholder="Select unit" /> */}
                </SelectTrigger>
                <SelectContent>
                  {selectItems?.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TableCell>
          {/* ✅ Combined Calories + Protein */}
          <TableCell className="text-right">
            <span className="text-primary">{row.calories} kcal</span>
            <span className="text-muted-foreground mx-1">|</span>
            <span className="text-accent">{row.protein}g</span>
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}
