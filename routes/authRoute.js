const router = require('express').Router()
const userController = require('../controllers/authController')

router.post('/users/login', (request, response) => { userController.userLogin(request,  response) })

module.exports = router