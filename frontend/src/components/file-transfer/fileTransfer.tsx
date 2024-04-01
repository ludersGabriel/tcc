import { useUploadFiles } from '@/api/vms/vm.mutation'
import { useCallback, useEffect } from 'react'
import toast from 'react-hot-toast'

type Props = {
  containerId: string
  vmId: number
}

export default function useFileTransfer({
  containerId,
  vmId,
}: Props) {
  const uploadFiles = useUploadFiles(vmId)

  const displayContainer =
    document.getElementById(containerId)

  const handleFiles = useCallback(
    (event: DragEvent) => {
      event.stopPropagation()
      event.preventDefault()

      if (displayContainer)
        displayContainer.style.backgroundColor = 'black'

      if (!event.dataTransfer?.files.length) return

      const files = event.dataTransfer.files

      const formData = new FormData()

      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i])
      }

      uploadFiles.mutate(formData, {
        onSuccess: (data) => {
          const t = data.success
            ? toast.success
            : toast.error

          t(data.message)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      })
    },
    [displayContainer, uploadFiles]
  )

  const handleDragOver = useCallback(
    (event: DragEvent) => {
      event.stopPropagation()
      event.preventDefault()

      if (displayContainer)
        displayContainer.style.backgroundColor = 'lightblue'
    },
    [displayContainer]
  )

  const handleDragLeave = useCallback(
    (event: DragEvent) => {
      event.stopPropagation()
      event.preventDefault()

      if (displayContainer)
        displayContainer.style.backgroundColor = 'black'
    },
    [displayContainer]
  )

  useEffect(() => {
    if (!displayContainer) return

    displayContainer.addEventListener(
      'dragover',
      handleDragOver
    )

    displayContainer.addEventListener(
      'dragleave',
      handleDragLeave
    )

    displayContainer.addEventListener('drop', handleFiles)

    return () => {
      displayContainer.removeEventListener(
        'dragover',
        handleDragOver
      )

      displayContainer.removeEventListener(
        'dragleave',
        handleDragLeave
      )

      displayContainer.removeEventListener(
        'drop',
        handleFiles
      )
    }
  }, [
    displayContainer,
    handleDragOver,
    handleDragLeave,
    handleFiles,
  ])
}
