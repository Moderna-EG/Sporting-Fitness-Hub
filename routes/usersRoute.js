const router = require('express').Router()
const usersController = require('../controllers/userController')
const { verifyMemberAndAdmin, verifyAdmin } = require('../middlewares/verifyToken')

router.get('/users', verifyMemberAndAdmin, (request, response) => usersController.getUsers(request, response))

router.post('/users', verifyAdmin, (request, response) => usersController.addUser(request, response))

router.put('/users/:userId', verifyAdmin, (request, response) => usersController.updateUser(request, response))

router.delete('/users/:userId', verifyAdmin, (request, response) => usersController.deleteUser(request, response))

router.get('/members/clubs/:club', verifyMemberAndAdmin, (request, response) => usersController.getClubMembers(request, response))

router.get('/members/clubs/:club/memberships/:membership', verifyMemberAndAdmin, (request, response) => usersController.getByMembership(request, response))

router.get('/members', verifyMemberAndAdmin, (request, response) => usersController.getMembers(request, response))

router.delete('/members/:memberId', verifyAdmin, (request, response) => usersController.deleteMember(request, response))

module.exports = router