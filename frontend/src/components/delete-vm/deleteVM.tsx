import { useDeleteVm } from '@/api/vms/vm.mutation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import toast from 'react-hot-toast'

import { MdOutlineDeleteForever as DeleteIcon } from 'react-icons/md'

export default function DeleteVM({
  vboxId,
}: {
  vboxId: string
}) {
  const deleteVm = useDeleteVm()

  function handleDelete() {
    deleteVm.mutate(vboxId, {
      onSuccess: (data) => {
        const t = data.success ? toast.success : toast.error

        t(data.message)
      },
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <DeleteIcon size={30} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            VM deletion is permanent. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
