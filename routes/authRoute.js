const router = require('express').Router()
const authController = require('../controllers/authController')

router.post('/auth/users/login', (request, response) => authController.userLogin(request,  response))

router.post('/auth/users/sign-up', (request, response) => authController.userSignUp(request, response))

router.post('/auth/members/login', (request, response) => authController.memberLogin(request, response))

router.post('/auth/members/sign-up', (request, response) => authController.memberSignUp(request, response))

router.post('/auth/admins/login', (request, response) => authController.adminLogin(request, response))

router.post('/auth/admins/sign-up', (request, response) => authController.adminSignUp(request, response))

router.post('/auth/reset-mail/:email', (request, response) => authController.resetEmail(request, response))

router.put('/auth/reset-password/:userId', (request, response) => authController.resetPassword(request, response))

module.exports = router