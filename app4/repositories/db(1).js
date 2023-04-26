const db=require('../knexfile')['production']
const knex=require('knex')(db)

export default knex