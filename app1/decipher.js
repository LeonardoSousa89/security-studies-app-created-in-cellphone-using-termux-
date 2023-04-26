const key=require('./key')

const crypto=require('crypto')
const algorithm='aes-256-ctr'

function decrypt(textCrypted){
  
  const crypography=crypto.createDecipher(algorithm, key)
  const plainText=crypography.update(textCrypted, 'base64', 'utf8')
  
  return plainText
}

const user1=decrypt('H1q9HN00dbkiyq7XH1yT')
const msg1=decrypt('XqwpFIltOed7k/yN')

console.table({ Users: user1 })
console.table({ Msg: msg1 })