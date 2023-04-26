import knex from '../repositories/db'
import { cipher, decipher } from '../config/security/crypto/crypto'
import { all } from '../projections/mailProjection'
import { 
  exceptionFieldNullOrUndefined,
  exceptionFieldIsEqualZero,
  exceptionFieldIsEmpty,
  exceptionFieldValueLessToType,
  exceptionFieldValueLongToType
} from './error/error'

import { attachPaginate } from 'knex-paginate'

import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv' 

attachPaginate()
dotenv.config()

const Secret=process.env.TOKEN_SECRET_KEY

/*
 essa função é uma callback no middleware do express, que será invocada ao ser passada como parâmetro antes da execução da rota em si
*/
async function authorizedClient(req, res, next){
  
   //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
  const authorization=req.headers['authorization']
 
  if(!authorization) return res.status(401).json({
    error: 'authorization not sended'
  })
  
  //req.headers['authorization'].split(' ')[1]
  const token=authorization.split(' ')[1]
  
  if(!token) return res.status(401).json({
      error: 'user must be logged'
  })
  
  console.log('')
   
  console.log('HEADERS: '+JSON.stringify(req.headers))
  console.log('')
  
  console.log('TOKEN: '+token)
  console.log('')
   
   /*
    aqui mesmo já é feito uma validação básica, se o token está ou não expirado
   */ 
  jwt.verify(token.trim(), Secret,(err, decoded)=>{
        if(err) {
          
            console.log(err)
            
            return res.status(401)
                      .json({
                        error: 'token invalid'
                          })
        }
        
        console.log('DECODED:'+JSON.stringify(decoded))
        console.log('')
        
        if(req.params.id != decoded.payload.id) return res.status(401).json({
          error: 'user not authorized'
        })
        
        /*
        essa variável é de acordo com a escolha do programador:
        
        ex: req.mano, req.payload, req.test ...
        
        embora seja mais usual, inserir um termo mais coerente com as informações/dados manipulados
        
        a chave sempre será o payload codificado para uso no sistema
        */
        req.payload=decoded.payload
        
        console.log('CLIENT PAYLOAD: '+JSON.stringify(req.payload))
        
        next()
    })
}

async function sendMail(req, res){
  
  const data={
    mail_destination: req.body.mail_destination,
    topic: req.body.topic,
    mail_msg: req.body.mail_msg,
    client_id: req.body.client_id
  }
  
 try{
    exceptionFieldNullOrUndefined(data.mail_destination, 'destination is undefined or null')
    exceptionFieldIsEmpty(data.mail_destination.trim(), 'destination can not be empty')
    exceptionFieldNullOrUndefined(data.mail_msg, 'email is undefined or null')
    exceptionFieldIsEmpty(data.mail_msg.trim(), 'email can not be empty')
    exceptionFieldNullOrUndefined(data.client_id, 'client id is undefined or null')
    exceptionFieldIsEqualZero(data.client_id, 'client id can not be empty')
  }catch(e){
    return res.status(400).json({
      error: e
    })
  }
  
  const mail_destinationCrypted=cipher(data.mail_destination)
  const topicCrypted=cipher(data.topic)
  const mail_msgCrypted=cipher(data.mail_msg)
  
  const dataCrypted={ 
     mail_destination: mail_destinationCrypted,
     topic: topicCrypted,
     mail_msg: mail_msgCrypted,
     client_id: data.client_id
  }
  
  console.log(data)
  console.log(dataCrypted)
  
  const sendbox=await knex.insert(dataCrypted)
                  .from('email_server')
                  .then(r=>{
                    
                    return res.status(201).json({
                      msg: 'email send'
                    })
                  })
                  .catch(_=>res.status(500).json({
                    msg: 'sorry, ocurred an error with server'
                  }))
  
  return sendbox
}

async function getMail(req, res){
  
  const mailMessage=await knex.select(all)
       .from('email_server')
       .innerJoin('client', 'client.id','email_server.client_id')
      .where('client.id', req.params.id)
     .paginate({ 
              perPage: req.query.size, 
              currentPage: req.query.page
            })
      .then(r=>{
        
        if(r.data.length===0) return res.status(404).json({
              error: 'there is not email in sandbox'
              })
                   
           const data=r.data.map(e=>{
             return {
               id: e._email_id,
               mail_destination: decipher(e.mail_destination),
               topic: decipher(e.topic),
               mail_msg: decipher(e.mail_msg)
                }
             })
           
          return res.status(200).json({
                data
            })
          }).catch(_=>res.status(500).json({
            msg: 'sorry, ocurred an error with server'
          }))
}

export {
  authorizedClient,
  sendMail,
  getMail
}