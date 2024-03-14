import { Express } from 'express'
import guacRoutes from './guac'
import loginRoute from './login'
import { auth } from '../middleware/auth'

const applyRoutes = (app: Express) => {
  app.use('/login', loginRoute)
  app.use('/', auth, guacRoutes)
}

export default applyRoutes
