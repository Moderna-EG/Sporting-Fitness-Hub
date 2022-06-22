const router = require('express').Router()
const usersController = require('../controllers/userController')

router.get('/users', (request, response) => usersController.getUsers(request, response))

router.post('/users', (request, response) => usersController.addUser(request, response))


module.exports = router