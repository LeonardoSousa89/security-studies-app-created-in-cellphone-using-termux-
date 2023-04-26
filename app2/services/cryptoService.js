require('dotenv').config()

import knex from '../repositories/db'
import crypto from 'crypto'

const key=process.env.SECRET_KEY
const algorithm=process.env.ALGORITHM

async function insertCryptData(req, res){
  
  let data={
    client: req.body.client.trim(),
    msg: req.body.msg.trim()
  }
  
  if(!data.client        || 
     data.client === ''  ||
     !data.msg           || 
     data.msg    === ''  
     ) return res.status(400).json({
       err: 'Os campos devem estar preenchidos'
     })
  
  //verificação em console
  console.table(data)
  
  const cryptography=crypto.createCipher(algorithm, key)
  const cryptedClient=cryptography.update(data.client, 'utf8','hex')
  const cryptedMsg=cryptography.update(data.msg, 'utf8','hex')
  
   let crypted={
     client: cryptedClient,
     msg: cryptedMsg
   }
  
   await knex.insert(crypted)
              .from('chat')
              .then(_=>{
                
                //verificação em console
                console.table({
                 cryptedClient, 
                 cryptedMsg
                })
                
                return res.status(201).json({
                         msg: 'mensagem enviada'
                       })
              })
              .catch(_=>res.status(500).json({
                err: 'Descupe, ocorreu um erro com o servidor'
              }))
}

async function getCryptData(res){
  
  await knex.select('*')
            .from('chat')
            .then(r=>{
             
              if(r.length === 0) return res.status(404).json({
                err: 'Não há dados inseridos'
              })
              
              return res.status(200).json(r)
            })
            .catch(_=>res.status(500).json({
              err: 'Descupe, ocorreu um erro com o servidor'
            }))
}

async function getDeCryptData(req, res){
  
  await knex.select('*')
            .from('chat')
            .where('id', req.params.id)
            .then(r=>{
             
              if(r.length === 0) return res.status(404).json({
                err: 'Não há dados inseridos'
              })
              
                for(let i in r){
                  var id=r[i].id
                  var client=r[i].client
                  var msg=r[i].msg
               
                  const crypography=crypto.createDecipher(algorithm, key)
                  const clientText=crypography.update(client, 'hex', 'utf8')
                  const msgText=crypography.update(msg, 'hex', 'utf8')
               
                var test=[{ 
                  id, 
                  client: clientText, 
                  msg: msgText 
                }]
             }
            
            //verificação em console
            console.table(test)
            
            return res.status(200).json(test)
            })
            .catch(_=>res.status(500).json({
              err: 'Descupe, ocorreu um erro com o servidor'
            })
          )
}

export {
  insertCryptData,
  getCryptData,
  getDeCryptData
}