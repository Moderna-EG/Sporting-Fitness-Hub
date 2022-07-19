const router = require('express').Router()
const membersPackagesController = require('../controllers/membersPackagesController')
const { verifyAdmin, verifyMemberAndAdmin } = require('../middlewares/verifyToken')

router.post('/members-packages/offline', (request, response) => membersPackagesController.registerOfflinePackage(request, response))

router.post('/members-packages/online', (request, response) => membersPackagesController.registerOnlinePackage(request, response))

router.get('/members-packages', (request, response) => membersPackagesController.searchMember(request, response))

router.get('/members-packages/all', (request, response) => membersPackagesController.getRegisteredPackages(request, response))

router.get('/members-packages/:club', (request, response) => membersPackagesController.getClubMembers(request, response))

router.put('/members-packages/attended/:registeredPackageId', (request, response) => membersPackagesController.updateMemberAttendance(request, response))

router.get('/members-packages/members/:memberId', (request, response) => membersPackagesController.getMemberRegisteredPackages(request, response))

router.delete('/members-packages/:memberPackageId', (request, response) => membersPackagesController.deleteRegisteredPackage(request,  response))

router.put('/members-packages/:memberPackageId/paid', (request, response) => membersPackagesController.updateMemberPaid(request, response))

router.post('/members-packages/members/:memberId/payment/pay-online', (request, response) => membersPackagesController.payOnline(request, response))

router.get('/members-packages/payment/:transactionUUID', (request, response) => membersPackagesController.checkTransaction(request, response))

router.get('/members-packages/members/:memberId/check-registeration', (request, response) => membersPackagesController.checkMemberRegistration(request, response))

module.exports = router

