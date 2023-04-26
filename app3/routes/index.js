import { signup, login, logout } from '../services/clientService'
import {  
  authorizedClient,
  sendMail,
  getMail
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

router.route('/user/:id').post(authorizedClient, function(req, res) {
  
  sendMail(req, res)
});

router.route('/user/:id').get(authorizedClient, function(req, res) {
  
  getMail(req, res)
});

export default router
