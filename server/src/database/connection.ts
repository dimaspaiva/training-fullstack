import knex from 'knex'

export default knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'omni11',
    database: 'omni11',
  },
})
