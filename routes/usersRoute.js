const router = require('express').Router()
const usersController = require('../controllers/userController')
const { verifyMemberAndAdmin, verifyAdmin } = require('../middlewares/verifyToken')

router.get('/users', (request, response) => usersController.getUsers(request, response))

router.post('/users', (request, response) => usersController.addUser(request, response))

router.put('/users/:userId', (request, response) => usersController.updateUser(request, response))

router.delete('/users/:userId', (request, response) => usersController.deleteUser(request, response))

router.get('/members/clubs/:club', (request, response) => usersController.getClubMembers(request, response))

router.get('/members/clubs/:club/memberships/:membership', (request, response) => usersController.getByMembership(request, response))

router.get('/members', (request, response) => usersController.getMembers(request, response))

router.delete('/members/:memberId', (request, response) => usersController.deleteMember(request, response))

module.exports = router