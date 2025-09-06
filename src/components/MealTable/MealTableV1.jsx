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
import { UNITS, UNIT_TYPES, sampleData, templateData } from '@/app/schemas/foodSchema'

export default function MealTable({ mealName = 'Breakfast' }) {
  const [rows, setRows] = useState(() =>
    sampleData.map((meal) => {
      meal.id ||= Date.now().toString(36) + Math.random().toString(36).substring(2, 10)
      return meal
    })
  )

  console.log('rows', rows)

  // Add a new empty row
  const addRow = () => {
    setRows([...rows, templateData])
  }

  const deleteRow = () => {
    setRows((prev) => prev.slice(0, prev.length - 1))
  }

  // Handle input changes
  const handleChange = ({ id, field, value }) => {
    setRows((prev) =>
      prev.map((food) => {
        if (food.id !== id) {
          return food
        }
        const updatedFood = { ...food }
        updatedFood[field] = value
        return updatedFood
      })
    )
  }

  const totalCalories = rows.reduce((sum, row) => sum + Number(row.calories), 0)
  const totalProtein = rows.reduce((sum, row) => sum + Number(row.protein), 0)

  const tableCellClassNames =
    'border-input bg-background text-foreground focus:ring-primary/50 w-full rounded-md border px-2 py-1 text-center text-sm focus:ring-2 focus:outline-none'

  return (
    <div className="bg-base-200 overflow-x-auto rounded-md p-4">
      <h2 className="mb-2 text-lg font-semibold">{mealName}</h2>
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Food</TableHead>
            <TableHead className="w-[150px]">Amount</TableHead>
            {/* ✅ Merge Calories + Protein */}
            <TableHead className="text-center">
              <span className="text-primary">Calories</span> /{' '}
              <span className="text-accent">Protein</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <GroupedTableRows
            group={rows}
            selectItems={[...UNITS.weight, ...UNITS.quantity]}
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
              onChange={(e) => handleChange({ id: row.id, field: 'food', value: e.target.value })}
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
                  handleChange({ id: row.id, field: 'value', value: e.target.value })
                }
                placeholder="0"
                className="h-[90%] p-0 text-center shadow-none"
              />

              <Select
                className="w-full"
                defaultValue={row.unit}
                onValueChange={(value) => handleChange({ id: row.id, field: 'unit', value })}
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
          {/* <TableCell className="text-right">
            <span className="text-primary">{row.calories} kcal</span>
            <span className="text-muted-foreground mx-1">|</span>
            <span className="text-accent">{row.protein}g</span>
          </TableCell> */}
          <TableCell className="text-primary max-w-[50px] text-center">{row.calories}</TableCell>
          <TableCell className="text-accent text-center">{row.protein}g</TableCell>
        </TableRow>
      ))}
    </>
  )
}
