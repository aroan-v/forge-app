import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { isValidElement, cloneElement } from 'react'

function ConfirmDialogWithTrigger({
  title,
  confirmationContent,
  dialogDescription,
  handleConfirmation,
  children,
}) {
  if (children && !isValidElement(children)) {
    throw new Error('ConfirmDeleteDialog expects `trigger` to be a valid React element')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructiveOutline" onClick={handleConfirmation}>
              {confirmationContent}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ConfirmDialog({
  open,
  setOpen,
  title,
  dialogDescription,
  handleConfirmation,
  confirmationContent = 'Yes',
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="defaultOutline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructiveOutline" onClick={handleConfirmation}>
              {confirmationContent}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ConfirmDialogWithTrigger }
export default ConfirmDialog
