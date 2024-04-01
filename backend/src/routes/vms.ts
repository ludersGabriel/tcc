import express from 'express'
import { CustomRequest, auth } from '../middleware/auth'
import {
  createVmService,
  deleteVmService,
  getVmsForUser,
  uploadFilesService,
} from '../services/vms'
import multer from 'multer'
import { getVmsById } from '../repositories/vms'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage })

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

router.post('/delete', async (req: CustomRequest, res) => {
  try {
    const user = req.user!
    const { vboxId } = req.body

    await deleteVmService(vboxId, user.id)

    res.status(200).json({
      status: 200,
      success: true,
      message: 'VM deletion complete!',
    })
  } catch (e) {
    console.log(e)

    res.status(500).json({
      message: 'Error deleting VM',
      status: 500,
      success: false,
    })
  }
})

router.post(
  '/upload',
  upload.array('files'),
  async (req: CustomRequest, res) => {
    try {
      const { vmId } = req.body
      const user = req.user!

      if (!Array.isArray(req.files) || !req.files?.length) {
        res.status(400).json({
          message: 'No files uploaded',
          status: 400,
          success: false,
        })
        return
      }

      const paths = req.files.map((file) => file.path)

      await uploadFilesService(
        parseInt(vmId),
        user.id,
        paths
      )

      res.status(200).json({
        status: 200,
        success: true,
        message: 'Files uploaded',
      })
    } catch (e) {
      console.log(e)
      res.status(500).json({
        message: 'Error uploading files',
        status: 500,
        success: false,
      })
    }
  }
)

export default router
