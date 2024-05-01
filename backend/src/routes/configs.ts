import express from 'express'
import { CustomRequest } from '../middleware/auth'
import {
  getConfigService,
  updateConfigService,
} from '../services/configs'
import { Config, ConfigInput } from '../db/schema'

const router = express.Router()

router.get('/', async (req: CustomRequest, res) => {
  try {
    const user = req.user!

    const configs = await getConfigService('main', user.id)

    res.status(200).json({
      configs,
      status: 200,
      success: true,
      message: 'Config retrieved',
    })
  } catch (e) {
    console.log(e)
    res.status(404).json({
      message: 'Error retrieving config',
      status: 404,
      success: false,
    })
  }
})

router.post('/update', async (req: CustomRequest, res) => {
  try {
    const user = req.user!

    const config: ConfigInput = {
      id: parseInt(req.body.id),
      totalMem: parseInt(req.body.totalMem),
      concurrentCreation: parseInt(
        req.body.concurrentCreation
      ),
    }

    await updateConfigService(config.id!, user.id, config)

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Config updated',
    })
  } catch (e) {
    console.log(e)
    res.status(404).json({
      message: 'Error updating config',
      status: 404,
      success: false,
    })
  }
})

export default router
