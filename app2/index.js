const port=54321

import server from './controllers/route'
import express from 'express'
import log from 'morgan'

const app=express()

app.use(log('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/', server)

app.listen(port,()=>console.table({port}))