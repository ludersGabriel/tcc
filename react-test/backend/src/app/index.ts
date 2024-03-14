import express from 'express'
import cors from 'cors'
import applyRoutes from '../routes'

const app = express()

app.use(cors())

app.use(express.json())

applyRoutes(app)

export default app
