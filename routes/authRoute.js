const router = require('express').Router()
const userController = require('../controllers/authController')

router.get('/users/login', (request, response) => { userController.userLogin(request,  response) })

module.exports = router