const router = require('express').Router()
const membersPackagesController = require('../controllers/membersPackagesController')
const { verifyAdmin, verifyMemberAndAdmin } = require('../middlewares/verifyToken')

router.post('/members-packages/offline', verifyMemberAndAdmin, (request, response) => membersPackagesController.registerOfflinePackage(request, response))

router.post('/members-packages/online', verifyMemberAndAdmin, (request, response) => membersPackagesController.registerOnlinePackage(request, response))

router.get('/members-packages', verifyMemberAndAdmin, (request, response) => membersPackagesController.searchMember(request, response))

router.get('/members-packages/all', verifyAdmin, (request, response) => membersPackagesController.getRegisteredPackages(request, response))

router.get('/members-packages/:club', verifyMemberAndAdmin, (request, response) => membersPackagesController.getClubMembers(request, response))

router.put('/members-packages/attended/:registeredPackageId', verifyMemberAndAdmin, (request, response) => membersPackagesController.updateMemberAttendance(request, response))

router.get('/members-packages/members/:memberId', verifyMemberAndAdmin, (request, response) => membersPackagesController.getMemberRegisteredPackages(request, response))

router.delete('/members-packages/:memberPackageId', verifyAdmin, (request, response) => membersPackagesController.deleteRegisteredPackage(request,  response))

module.exports = router

