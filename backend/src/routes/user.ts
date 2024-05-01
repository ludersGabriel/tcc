import express from 'express'
import { CustomRequest } from '../middleware/auth'
import {
  getUserByIdService,
  getUsersService,
  upsertUser,
} from '../services/users'
import { UserDto } from '../repositories/users'

const router = express.Router()

router.get('/', async (req: CustomRequest, res) => {
  try {
    const user = req.user!

    const dbUser: UserDto | undefined =
      await getUserByIdService(user.id)

    if (!dbUser) {
      throw new Error('Invalid user')
    }

    res.status(200).json({
      status: 200,
      success: true,
      message: 'User found',
      user: dbUser,
    })
  } catch (e) {
    console.log(e)
    res.status(404).json({
      message: 'Invalid user or password',
      status: 404,
      success: false,
    })
  }
})

router.get('/users', async (req: CustomRequest, res) => {
  try {
    const user = req.user!

    const users = await getUsersService(user.id)

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Users retrieved',
      users,
    })
  } catch (e) {
    console.log(e)
    res.status(404).json({
      message: 'Error retrieving users',
      status: 404,
      success: false,
    })
  }
})

router.post('/upsert', async (req: CustomRequest, res) => {
  try {
    const user = req.user!
    const data = req.body

    const newUser = await upsertUser(user.id, data)

    res.status(200).json({
      status: 200,
      success: true,
      message: 'User created or updated',
      user: newUser,
    })
  } catch (e) {
    console.log(e)
    res.status(404).json({
      message: 'Error updating user',
      status: 404,
      success: false,
    })
  }
})

export default router
