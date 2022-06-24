const router = require('express').Router()
const usersController = require('../controllers/userController')

router.get('/users', (request, response) => usersController.getUsers(request, response))

router.post('/users', (request, response) => usersController.addUser(request, response))

router.get('/members/clubs/:club', (request, response) => usersController.getClubMembers(request, response))

router.get('/members/clubs/:club/memberships/:membership', (request, response) => usersController.getByMembership(request, response))

module.exports = router