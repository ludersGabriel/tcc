import express from 'express'
import { CustomRequest, auth } from '../middleware/auth'
import { getVmsForUser } from '../services/vms'

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

export default router
