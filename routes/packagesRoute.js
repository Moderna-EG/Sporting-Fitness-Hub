const router = require('express').Router()
const packagesController = require('../controllers/packagesController')
const { verifyToken, verifyAdmin } = require('../middlewares/verifyToken')


router.get('/packages', verifyToken, (request, response) => packagesController.getPackages(request, response))

router.put('/packages/:packageId', verifyAdmin, (request, response) => packagesController.updatePackage(request, response))

router.post('/packages', verifyAdmin, (request, response) => packagesController.addPackage(request, response))

router.delete('/packages/:packageId', verifyAdmin, (request, response) => packagesController.deletePackage(request, response))

module.exports = router