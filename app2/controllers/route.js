import {
  insertCryptData,
  getCryptData,
  getDeCryptData
} from '../services/cryptoService'
import express from 'express'

const server=express.Router()

server.route('/cipher').post((req, res)=>{
  
  insertCryptData(req, res)
})

server.route('/cipher').get((req, res)=>{
  
  getCryptData(res)
})

server.route('/decipher/:id').get((req, res)=>{
  
  getDeCryptData(req, res)
})

export default server