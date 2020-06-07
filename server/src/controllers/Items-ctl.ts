import { Request, Response } from 'express'

import knex from '../database/connection'

export default class ItemsControllers {
  async index(req: Request, res: Response) {
    const items = await knex('items').select('*')

    const serializedItems = items.map((item) => ({
      ...item,
      imageUrl: `http://192.168.100.65:3333/uploads/${item.image}`,
    }))

    return res.json(serializedItems)
  }
}
