import { Request, Response } from 'express'
import knex from '../database/connection'

export default class PointsController {
  async create(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      uf,
      city,
      items,
    } = req.body

    const trx = await knex.transaction()

    const point = {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      uf,
      city,
    }

    const insertedId = await trx('points').insert({
      image:
        'http://images.pexels.com/photos/95425/pexels-photo-95425.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=200',
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    })

    const pointItems = items.map((item: number) => ({
      item_id: item,
      point_id: insertedId[0],
    }))

    await trx('point_items').insert(pointItems)

    await trx.commit()

    return res.json({ point: { id: insertedId[0], ...point } })
  }

  async show(req: Request, res: Response) {
    const { id } = req.params

    const point = await knex('points').where('id', id).first()

    if (!point) {
      return res.status(400).json({ message: 'Point not found' })
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title')

    return res.json({ ...point, items })
  }

  async index(req: Request, res: Response) {
    const { city, uf, items } = req.query

    if (!city && !uf && !items) {
      const points = await knex('points')
        .join('point_items', 'points.id', '=', 'point_items.point_id')
        .distinct()
        .select('points.*')
        .limit(5)

      return res.json(points)
    }

    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()))

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')

    console.log(city, uf, parsedItems)
    return res.json(points)
  }
}
