import { useControlVm } from '@/api/vms/vm.mutation'
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

import { AiOutlinePoweroff as OnButton } from 'react-icons/ai'

export default function ControlVm({
  vmId,
  action,
}: {
  vmId: number
  action: 'start' | 'stop'
}) {
  const controlVm = useControlVm()

  function handleControl() {
    controlVm.mutate(
      { action, vmId },
      {
        onSuccess: (data) => {
          const t = data.success
            ? toast.success
            : toast.error

          t(data.message)
        },
      }
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <OnButton size={30} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to{' '}
            {action === 'start' ? 'start' : 'stop'} this VM?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleControl}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
