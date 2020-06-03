import express from 'express'

import Points from './controllers/Points-ctl'
import Items from './controllers/Items-ctl'

const points = new Points()
const items = new Items()

const routes = express.Router()

routes.get('/', (req, res) => {
  return res.json({ message: 'hello world!' })
})

routes.get('/items', items.index)

routes.get('/points/:id', points.show)
routes.get('/points/', points.index)
routes.post('/points', points.create)

export default routes
