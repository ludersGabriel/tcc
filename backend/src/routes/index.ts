import { Express } from 'express'
import guacRoutes from './guac'
import loginRoute from './login'
import vmRoutes from './vms'
import userRoutes from './user'
import configsRoutes from './configs'
import ovaRoutes from './ova'
import { auth } from '../middleware/auth'

const applyRoutes = (app: Express) => {
  app.use('/login', loginRoute)
  app.use('/vms', auth, vmRoutes)
  app.use('/getToken', auth, guacRoutes)
  app.use('/user', auth, userRoutes)
  app.use('/configs', auth, configsRoutes)
  app.use('/ovas', auth, ovaRoutes)
}

export default applyRoutes
