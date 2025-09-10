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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export default function SettingsAction({ groupName, onDelete, onEdit }) {
  const [open, setOpen] = useState(false)

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
          <DropdownMenuItem className="text-destructive" onClick={() => setOpen(true)}>
            <Trash2 className="text-destructive" size={16} strokeWidth={1.5} />
            Delete Group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold">{groupName}</span>?
              This action cannot be undone.
            </DialogDescription>
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
      </Dialog>
    </>
  )
}
