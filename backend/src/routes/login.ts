import express from 'express'
import { User } from '../db/schema'
import { login } from '../services/login'
import jwt from 'jsonwebtoken'
import { SECRET_KEY } from '../middleware/auth'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const user: User = req.body
    const { username, password } = user

    const validUser = await login(username, password)

    const token = jwt.sign(
      { id: validUser.id, username: validUser.username },
      SECRET_KEY
    )

    res.status(200).json({
      status: 200,
      success: true,
      token,
      message: 'User logged in',
    })
  } catch (e) {
    console.log(e)

    res.status(404).json({
      message: 'Invalid user or password',
      status: 404,
      sucess: false,
    })
  }
})

export default router
