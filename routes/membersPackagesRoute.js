const router = require('express').Router()
const membersPackagesController = require('../controllers/membersPackagesController')

router.post('/members-packages', (request, response) => membersPackagesController.addPackage(request, response))

router.get('/members-packages', (request, response) => membersPackagesController.searchMember(request, response))

module.exports = router

