import express from 'express'
import { encryptToken } from '../encryptToken'
import { getVmsByIdService } from '../services/vms'
import { CustomRequest } from '../middleware/auth'

const router = express.Router()

router.get('/', async (req: CustomRequest, res) => {
  try {
    const { vmId } = req.query
    const user = req.user!

    if (!vmId) {
      res.status(400).json({
        message: 'VM ID not provided',
        status: 400,
        success: false,
      })
      return
    }

    const vm = await getVmsByIdService(+vmId, user.id)

    if (!vm) {
      res.status(404).json({
        message: 'VM not found',
        status: 404,
        success: false,
      })
      return
    }

    const { id, name, description, ownerId, ...settings } =
      vm

    const token = encryptToken(settings)

    res.send({ token })
  } catch (e) {
    console.log(JSON.stringify(e))
    res.status(404).json({
      message: 'Could not retrieve VM settings',
      status: 404,
      success: false,
    })
  }
})

export default router
