'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function MealTrackerTable() {
  const [rows, setRows] = useState([{ breakfast: '', lunch: '', dinner: '' }])

  // Add a new empty row
  const addRow = () => {
    setRows([...rows, { breakfast: '', lunch: '', dinner: '' }])
  }

  // Handle input changes
  const handleChange = (index, field, value) => {
    const updated = [...rows]
    updated[index][field] = value
    setRows(updated)
  }

  return (
    <div className="border-border overflow-x-auto rounded-md border">
      <table className="divide-border min-w-full divide-y">
        <thead className="bg-muted">
          <tr>
            <th className="text-foreground px-4 py-2 text-left text-sm font-medium">Breakfast</th>
            <th className="text-foreground px-4 py-2 text-left text-sm font-medium">Lunch</th>
            <th className="text-foreground px-4 py-2 text-left text-sm font-medium">Dinner</th>
          </tr>
        </thead>
        <tbody className="bg-background divide-border divide-y">
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-accent/10">
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={row.breakfast}
                  onChange={(e) => handleChange(index, 'breakfast', e.target.value)}
                  className="border-input bg-background text-foreground focus:ring-primary/50 w-full rounded-md border px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={row.lunch}
                  onChange={(e) => handleChange(index, 'lunch', e.target.value)}
                  className="border-input bg-background text-foreground focus:ring-primary/50 w-full rounded-md border px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                />
              </td>
              <td className="px-4 py-2">
                <input
                  type="text"
                  value={row.dinner}
                  onChange={(e) => handleChange(index, 'dinner', e.target.value)}
                  className="border-input bg-background text-foreground focus:ring-primary/50 w-full rounded-md border px-2 py-1 text-sm focus:ring-2 focus:outline-none"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 flex justify-end">
        <Button onClick={addRow} size="sm" variant="secondary">
          Add Row
        </Button>
      </div>
    </div>
  )
}
