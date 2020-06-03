import path from 'path'

module.exports = {
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'omni11',
    database: 'omni11',
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname, 'src', 'database', 'seeds'),
  },
}
