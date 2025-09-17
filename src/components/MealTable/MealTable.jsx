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
import { useFoodStoreVersionTwo } from '@/app/store/useFoodStore'
import { Textarea } from '../ui/textarea'
import { cn } from '@/lib/utils'
import MealTableRows from './MealTableRows'
import { devLog } from '@/lib/logger'

function MealTable({ groupId }) {
  devLog('MealTable - groupId', groupId)

  const groupInfo = useFoodStoreVersionTwo((s) => s.groupsById?.[groupId])
  const deleteMealRow = useFoodStoreVersionTwo((s) => s.deleteMealRow)
  const addMealRow = useFoodStoreVersionTwo((s) => s.addMealRow)

  devLog('groupInfo', groupInfo)
  devLog('currentState', useFoodStoreVersionTwo.getState())

  const meals = []
  const groupName = groupInfo?.name
  const mealIds = groupInfo?.mealIds
  const totalCalories = groupInfo?.totalCalories || 0
  const totalProtein = groupInfo?.totalProtein || 0

  devLog('mealIds', mealIds)

  const [deleteMode, setDeleteMode] = useState(false)

  const [isEditingHeader, setIsEditingHeader] = useState(false)
  const updateGroupName = useFoodStoreVersionTwo((s) => s.updateGroupName)

  const handleSave = (groupName) => {
    if (isEditingHeader) {
      console.log('Saved:', groupName)
      updateGroupName({ groupId, groupName })
    }
    setIsEditingHeader(!isEditingHeader)
  }

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

  // Early return
  if (!groupInfo) return

  return (
    <motion.div
      animate={{ height: 'auto' }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      layout
      className="bg-base-200 relative overflow-scroll rounded-md p-4"
    >
      <motion.div layout className="absolute top-6 right-2 -translate-y-1/2">
        <SettingsAction groupId={groupId} onEdit={() => setIsEditingHeader(true)} />
      </motion.div>

      <GroupHeader
        initialVal={groupName}
        setIsEditingHeader={setIsEditingHeader}
        isEditingHeader={isEditingHeader}
        handleSave={handleSave}
      />

      <TableStructure
        deleteMode={deleteMode}
        totalCalories={totalCalories}
        totalProtein={totalProtein}
      >
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
      </TableStructure>

      <div className="mt-4 flex justify-center gap-2">
        {deleteMode ? (
          <>
            <Button size="sm" variant="defaultOutline" onClick={() => setDeleteMode(false)}>
              Cancel Delete Rows
            </Button>
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

function TableStructure({ deleteMode, totalCalories, totalProtein, children }) {
  devLog('TableStructure rendered')
  return (
    <MotionTable className="table-fixed">
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
          <TableHead className="text-secondary w-[75px] text-center">Protein</TableHead>
        </MotionTableRow>
      </MotionTableHeader>

      <TableBody>
        {children}

        <MotionTableRow className="bg-muted/20 font-semibold">
          <TableCell></TableCell>
          {deleteMode && <TableCell></TableCell>}
          <TableCell className="text-center"></TableCell>
          <TableCell className="text-center">
            <span className="text-primary">{totalCalories}kcal</span>
          </TableCell>
          <TableCell className="text-center">
            <span className="text-secondary">{totalProtein}g</span>
          </TableCell>
        </MotionTableRow>
      </TableBody>
    </MotionTable>
  )
}

export default React.memo(MealTable)

function GroupHeader({ initialVal, setIsEditingHeader, isEditingHeader, handleSave }) {
  const [localGroupName, setLocalGroupName] = React.useState(initialVal)

  // This is for better UX, automatically focuses on the header input when changing the group name
  const inputRef = React.useRef(null)

  React.useEffect(() => {
    if (isEditingHeader && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 500)
    }
  }, [isEditingHeader])

  return (
    <motion.div layout="size" className="mb-2 flex w-[95%] gap-4 align-middle">
      <Input
        value={localGroupName ?? ''}
        placeholder="Food Group"
        onChange={(e) => setLocalGroupName(e.target.value)}
        onBlur={() => setIsEditingHeader(false)}
        ref={inputRef}
        disabled={!isEditingHeader}
        className={`custom-ds-input flex-1 text-lg font-semibold ${!localGroupName && 'italic'}`}
      />

      <AnimatePresence mode="wait">
        {isEditingHeader && (
          <MotionButton
            key="save-btn"
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={motionTransition}
            variant="defaultOutline"
            size="fill"
            onClick={() => handleSave(localGroupName)}
          >
            Save
          </MotionButton>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
