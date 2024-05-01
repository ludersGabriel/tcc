import { useConfigs } from '@/api/configs/configs.query'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import UpdateConfig, { ConfigForm } from './update-config'
import { useState } from 'react'

export default function Configs() {
  const [selected, setSelected] =
    useState<ConfigForm | null>(null)
  const [open, setOpen] = useState<boolean>(false)

  const { configs } = useConfigs()

  const handleOpen = () => {
    setOpen(!open)
  }

  const setForm = (config: ConfigForm) => {
    setSelected(config)
    handleOpen()
  }

  return (
    <>
      <Table>
        <TableCaption>Current Configs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Total Memory (%)</TableHead>
            <TableHead>Concurrent Creation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            onClick={() => setForm(configs)}
            className='cursor-pointer'
          >
            <TableCell>{configs?.key}</TableCell>
            <TableCell>{configs?.totalMem}</TableCell>
            <TableCell>
              {configs?.concurrentCreation}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      {selected && (
        <UpdateConfig
          config={configs}
          open={open}
          setOpen={setOpen}
        />
      )}
    </>
  )
}
