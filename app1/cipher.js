const key=require('./key')
const crypto=require('crypto')

const algorithm='aes-256-ctr'

function crypt(text){
 
 const crypography=crypto.createCipher(algorithm, key)
 const crypted=crypography.update(text, 'utf8','base64')
 
 return crypted
}

const user1=crypt('55 (71)98765-6578')
const msg1=crypt('tô chegando!')

//https://developer.mozilla.org/pt-BR/docs/Web/API/console/table
console.table({ Users: user1 })
console.table({ Msg: msg1 })
