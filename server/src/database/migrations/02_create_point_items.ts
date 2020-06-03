import Knex from 'knex'

export async function up(knex: Knex) {
  return knex.schema.createTable('point_items', (table) => {
    table.increments('id').primary()

    table.integer('point_id').notNullable()
    table.foreign('point_id').references('points')

    table.integer('item_id').notNullable()
    table.foreign('item_id').references('items')
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('point_items')
}
