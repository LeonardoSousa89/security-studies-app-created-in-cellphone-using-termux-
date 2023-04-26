require('dotenv').config()

module.exports = {
  
 development: {
    client: 'postgres',
    connection: {
      database: 'database',
      user:     'user',
      password: '1234'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  
  production: {
    client: process.env.CLIENT,
    connection: {
      host:     process.env.HOST,
      database: process.env.DATABASE,
      user:     process.env.USER,
      password: process.env.PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};