'use client'

import { useState } from 'react'
import { EllipsisVertical, SquarePen, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'


import ConfirmDialog from '../ConfirmDialog'
import { useFoodStoreVersionTwo } from '@/app/store/useFoodStore'

export default function SettingsAction({ groupName, groupId, onEdit }) {
  const [open, setOpen] = useState(false)
  const deleteFoodGroup = useFoodStoreVersionTwo((s) => s.deleteFoodGroup)

  const dialogDescription = (
    <>
      Are you sure you want to delete <span className="font-semibold">{groupName}</span>? This
      action cannot be undone.
    </>
  )

  return (
    <>
      {/* Dropdown Trigger */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVertical size={16} strokeWidth={1.5} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <SquarePen size={16} strokeWidth={1.5} /> Edit Group Name
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault()
              setOpen(true)
            }}
          >
            <div className="text-destructive flex items-center gap-2">
              <Trash2 className="text-destructive" size={16} strokeWidth={1.5} />
              Delete Group
            </div>
          </DropdownMenuItem>

          {/* <ConfirmDialog
            title="Delete Group"
            dialogDescription={dialogDescription}
            handleConfirmation={() => deleteFoodGroup(groupId)}
            confirmationContent="Yes, delete"
          >
            <DropdownMenuItem className="text-destructive">
              <div>
                <Trash2 className="text-destructive" size={16} strokeWidth={1.5} />
                Delete Group
              </div>
            </DropdownMenuItem>
          </ConfirmDialog> */}
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={open}
        setOpen={setOpen}
        title="Delete Group"
        dialogDescription={dialogDescription}
        handleConfirmation={() => deleteFoodGroup(groupId)}
        confirmationContent="Yes, delete"
      />

      {/* <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="defaultOutline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructiveOutline"
              onClick={() => {
                onDelete()
                setOpen(false)
              }}
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </>
  )
}
