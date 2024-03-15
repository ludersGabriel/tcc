import { Express } from 'express'
import guacRoutes from './guac'
import loginRoute from './login'
import vmRoutes from './vms'
import { auth } from '../middleware/auth'

const applyRoutes = (app: Express) => {
  app.use('/login', loginRoute)
  app.use('/vms', auth, vmRoutes)
  app.use('/getToken', auth, guacRoutes)
}

export default applyRoutes
