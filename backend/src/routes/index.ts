import { Express } from 'express'
import guacRoutes from './guac'
import loginRoute from './login'
import vmRoutes from './vms'
import userRoutes from './user'
import { auth } from '../middleware/auth'

const applyRoutes = (app: Express) => {
  app.use('/login', loginRoute)
  app.use('/vms', auth, vmRoutes)
  app.use('/getToken', auth, guacRoutes)
  app.use('/user', auth, userRoutes)
}

export default applyRoutes
