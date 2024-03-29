import express from 'express'
import { CustomRequest, auth } from '../middleware/auth'
import {
  createVmService,
  getVmsForUser,
} from '../services/vms'

const router = express.Router()

router.get('/', async (req: CustomRequest, res) => {
  try {
    const user = req.user!

    const vms = (await getVmsForUser(user.id)).map(
      (vm) => ({
        ...vm,
        status: 'on',
      })
    )

    res.status(200).json({
      vms,
      status: 200,
      success: true,
      message: 'VMs retrieved',
    })
  } catch (e) {
    console.log(JSON.stringify(e))
    res.status(404).json({
      message: 'VMs not found',
      status: 404,
      success: false,
    })
  }
})

router.post('/create', (req: CustomRequest, res) => {
  try {
    const user = req.user!
    const { name, description } = req.body

    createVmService(name, description, user.id)

    res.status(200).json({
      status: 200,
      success: true,
      message:
        'Request to create VM received. Check back later.',
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: 'Error creating VM',
      status: 500,
      success: false,
    })
  }
})

export default router
