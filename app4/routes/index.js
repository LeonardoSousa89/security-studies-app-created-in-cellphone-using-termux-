import { 
  signup, 
  login, 
  logout 
} from '../services/clientService'

import {  
  authorizedClient,
  sendMail,
  sendedMail,
  receivedMail
} from '../services/mailService'

import  express from 'express'

var router = express.Router();

router.route('/signup').post(function(req, res) {

  signup(req, res)
})

router.route('/login').post(function(req, res) {
  
  login(req, res)
})

router.route('/signout').post(function(req, res) {
  
  logout(req, res)
})

router.route('/send/user/:id').post(authorizedClient, function(req, res) {
  
  sendMail(req, res)
});

router.route('/sendbox/:id/user').get(authorizedClient, function(req, res) {
  
  sendedMail(req, res)
});

router.route('/inbox/:id/user').get(authorizedClient, function(req, res) {
  
  receivedMail(req, res)
});

export default router
