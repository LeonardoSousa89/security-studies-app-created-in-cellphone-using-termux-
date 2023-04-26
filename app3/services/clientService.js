import knex from '../repositories/db'
import { cipher, decipher } from '../config/security/crypto/crypto'
import { 
  exceptionFieldNullOrUndefined,
  exceptionFieldIsEmpty,
  exceptionFieldValueLessToType,
  exceptionFieldValueLongToType
} from './error/error'

import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv' 

dotenv.config()

const Secret=process.env.TOKEN_SECRET_KEY

async function signup(req, res){
  
  const data={
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  }
  
  try{
    exceptionFieldNullOrUndefined(data.email, 'email is undefined or null')
    exceptionFieldIsEmpty(data.email.trim(), 'email can not be empty')
    exceptionFieldNullOrUndefined(data.password, 'password is undefined or null')
    exceptionFieldIsEmpty(data.password.trim(), 'invalid password')
    exceptionFieldValueLessToType(data.password.trim(), 'password must be greather than 4')
    exceptionFieldValueLongToType(data.password.trim(), 'password maximun size 8')
  }catch(e){
    return res.status(400).json({
      error: e
    })
  }
  
  const passwordCrypted=cipher(data.password)
   
   /*
   Aviso**:
   Não é recomendado o uso do crypto para senhas, mas devido a problemas com instalação do bcrypt, eu o utilizei para fins educativos. 
   O crypto gera uma mesma criptografia para todos os dados iguais,
   EX: todos os password 123 terão uma mesma criptografia, 
   todos as frase iguais terão uma mesma criptografia, o que facilitaria um roubo de dados
   */
   
   //aviso*
   // .trim() não surte efeito em dados criptografados, com espaço e sem espaço geram dados diferentes
   
   //aviso***
   //visto que não há uma verificação de envio ou não desta variável, atribuir um metodo de string por exemplo geraria uma excessão caso o dado fosse null ou undefined. para evitar bugs dentro deste elemento não obrigatório, tendo em vista que a sua não inserção pode crashear a aplicação, neste caso não insiro o .trim()
  const dataCrypted={
    name: data.name, //***
    email: data.email.trim(), 
    password: passwordCrypted.trim() //** //*
  }
  
 const clientAlreadyExist=await knex.where('email', dataCrypted.email)
                   .from('client')
                   .first()
  
  if(clientAlreadyExist) return res.status(400).json({  msg: 'email already exist' })
  
  const client=await knex.insert(dataCrypted)
            .from('client')
            .then(_=>{
              res.redirect(201, 'http://127.0.0.1:34568/login')
            })
            .catch(_=>res.status(500).json({
              msg: 'sorry, ocurred an error with server' 
            }))
  
  return client 
}

async function login(req, res){
  
  const data={
    email: req.body.email,
    password: req.body.password
  }
  
  try{
    exceptionFieldNullOrUndefined(data.email, 'email is undefined or null')
    exceptionFieldIsEmpty(data.email.trim(), 'email can not be empty')
    exceptionFieldNullOrUndefined(data.password, 'password is undefined or null')
    exceptionFieldIsEmpty(data.password.trim(), 'invalid password')
    exceptionFieldValueLessToType(data.password.trim(), 'password must be greather than 4')
    exceptionFieldValueLongToType(data.password.trim(), 'password maximun size 8')
  }catch(e){
    return res.status(400).json({
      error: e
    })
  }
  
  const passwordCrypted=cipher(data.password)
  
   //aviso*
   // .trim() não surte efeito em dados criptografados, com espaço e sem espaço geram dados diferentes
  const dataCrypted={ 
    password: passwordCrypted.trim() //*  
  }
  
  const clientAlready=await knex.where('email', data.email)
        .from('client')
        .first()
  
  if(!clientAlready) return res.status(400).json({  msg: 'email not exist' })

  var comparePassword=false
  var payload={}
  
  const cryptedPassword=await knex.select('*')
  .from('client')
  .where('email', data.email)
  .then(r=>{
    if(r.length===0) return []
    
    payload={
      id: r[0].id,
      name: r[0].name,
      email: r[0].email
    }
    
    var compare=r[0].password===dataCrypted.password

    comparePassword=compare
  })
  
  if(comparePassword !== true)return res.status(401).json({
      error: 'password incorrect! verify if has blank spaces, password is correctly write'
  })
  
   const minutes=300 //5 minutos
  
   const token=await jwt.sign(
                  { payload },
                    Secret,
                  { expiresIn: minutes })
  
  return knex.where('email', data.email)
             .first()
             .table('client')
             .then(r=>{
               
                const data={
                    id: r.id,
                    name: r.name,
                    email: r.email
                    }
               
                res.status(200).json({
                     client: data,
                     auth: true,
                     token
                })
             })
           .catch(_=>res.status(500).json({
             error: 'sorry, ocurred an error with server'
          }))
  
}

//este metodo e rota são opcionais, o client-side substituirá os dados em seu cookie ou localstorage por estes e pode por exemplo redirecionar o usuário para a tela de login

//https://www.luiztools.com.br/post/autenticacao-json-web-token-jwt-em-nodejs/
async function logout(req, res){
  
 res.status(200).json({
   client: null,
   auth: false,
   token: null
 })
}

export {
  signup,
  login,
  logout
}