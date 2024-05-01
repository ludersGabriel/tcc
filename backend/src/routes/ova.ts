import express from 'express'
import { CustomRequest } from '../middleware/auth'
import { getOvas } from '../services/ova'

const router = express.Router()

router.get('/', async (req: CustomRequest, res) => {
  try {
    const ovas = await getOvas()

    res.status(200).json({
      ovas,
      status: 200,
      success: true,
      message: 'Ovas retrieved',
    })
  } catch (e) {
    console.log(e)
    res.status(404).json({
      message: 'Error retrieving ovas',
      status: 404,
      success: false,
    })
  }
})

export default router
