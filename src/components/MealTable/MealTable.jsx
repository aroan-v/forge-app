'use client'
import React from 'react'
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
import { useFoodStore, useFoodStoreVersionTwo } from '@/app/store/useFoodStore'
import { Textarea } from '../ui/textarea'
import { cn } from '@/lib/utils'
import MealTableRows from './MealTableRows'
import { devLog } from '@/lib/logger'

function MealTable({ groupId }) {
  devLog('group with an id rendered', groupId)
  // Declare the initial meals to the local state

  // Version Two
  const groupInfo = useFoodStoreVersionTwo((s) => s.groupsById[groupId])
  const deleteMealRow = useFoodStoreVersionTwo((s) => s.deleteMealRow)

  devLog('groupInfo', groupInfo)

  const meals = []
  const mealName = groupInfo?.name
  const mealIds = groupInfo?.mealIds

  devLog('mealIds', mealIds)

  const [rows, setRows] = useState(meals)
  const [deleteMode, setDeleteMode] = useState(false)
  const addMealRow = useFoodStore((s) => s.addMealRow)
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

  // Handle Toggling of rows to delete
  const [idsToDelete, setIdsToDelete] = useState([])
  const handleToggleId = React.useCallback((rowId) => {
    setIdsToDelete((prev) => {
      if (prev.includes(rowId)) {
        return prev.filter((id) => id !== rowId)
      } else {
        return [...prev, rowId]
      }
    })
  }, [])

  devLog('idsToDelete', idsToDelete)

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
          <MealTableRows
            group={meals}
            mealIds={mealIds}
            selectItems={[...UNITS.weight, ...UNITS.quantity]}
            groupId={groupId}
            deleteMode={deleteMode}
            setDeleteMode={setDeleteMode}
            idsToDelete={idsToDelete}
            handleToggleId={handleToggleId}
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
              disabled={idsToDelete.length === 0}
              variant="destructiveOutline"
              size="sm"
              onClick={() => {
                setTimeout(() => setDeleteMode(false), 1000)
                setIdsToDelete([])
                deleteMealRow({ targetMealIds: idsToDelete, targetGroupId: groupId })
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
              disabled={mealIds.length >= 10}
              onClick={() => addMealRow(groupId)}
              size="sm"
              variant="defaultOutline"
            >
              Add Row
            </Button>
            <Button
              disabled={mealIds.length <= 1}
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

export default React.memo(MealTable)
