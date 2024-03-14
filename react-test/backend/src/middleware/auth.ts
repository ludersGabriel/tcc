import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const SECRET_KEY: Secret = 'YOUR_SECRET'
export const SALT_ROUNDS = 10

export interface CustomRequest extends Request {
  token: string | JwtPayload
}

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req
      .header('Authorization')
      ?.replace('Bearer ', '')

    if (!token) {
      throw new Error()
    }

    const decoded = jwt.verify(token, SECRET_KEY)
    ;(req as CustomRequest).token = decoded

    next()
  } catch (err) {
    res.status(401).send('Please authenticate')
  }
}

export async function myHash(password: string) {
  try {
    const hashed = await bcrypt.hash(password, SALT_ROUNDS)

    return hashed
  } catch (e) {
    console.log('Error hasing: ', JSON.stringify(e))

    throw new Error('Error hashing password')
  }
}

export async function verifyHash(
  candidate: string,
  hash: string
) {
  try {
    return await bcrypt.compare(candidate, hash)
  } catch (e) {
    console.log('Error verifying hash: ', JSON.stringify(e))

    throw new Error('Error verifying hash')
  }
}
