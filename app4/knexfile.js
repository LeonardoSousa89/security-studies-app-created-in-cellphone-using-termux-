import * as dotenv from 'dotenv' 
dotenv.config()

module.exports={

  development: {
    client:     'postgresql',
    connection: {
      database: 'database',
      user:     'user',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  production: {
    client:     process.env.CLIENT,
    connection: {
      host: process.env.HOST,
      database: process.env.DATABASE,
      user:     process.env.USER,
      password: process.env.PASSWORD
      
    },
    pool: {
      min: 2,
      max: 10
    },
  }
  
};