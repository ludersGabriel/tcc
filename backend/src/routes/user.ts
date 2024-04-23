import express from 'express'
import { CustomRequest } from '../middleware/auth'
import { getUserByIdService } from '../services/users'
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

export default router
