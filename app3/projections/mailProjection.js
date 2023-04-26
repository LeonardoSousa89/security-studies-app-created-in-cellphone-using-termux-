//alias _
const all=[
  'client.id AS _client_id', 
  'client.name', 
  'client.email', 
  'email_server.id AS _email_id',
  'email_server.mail_destination',
  'email_server.topic',
  'email_server.mail_msg',
  'email_server.client_id'
]

export {  all  }