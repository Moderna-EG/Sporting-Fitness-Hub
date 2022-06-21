const router = require('express').Router()
const membersPackagesController = require('../controllers/membersPackagesController')

router.post('/members-packages/offline', (request, response) => membersPackagesController.registerOfflinePackage(request, response))

router.post('/members-packages/online', (request, response) => membersPackagesController.registerOnlinePackage(request, response))

router.get('/members-packages', (request, response) => membersPackagesController.searchMember(request, response))

router.get('/members-packages/:club', (request, response) => membersPackagesController.getClubMembers(request, response))

router.put('/members-packages/attended/:registeredPackageId', (request, response) => membersPackagesController.updateMemberAttendance(request, response))

module.exports = router

