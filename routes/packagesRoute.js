const router = require('express').Router()
const packagesController = require('../controllers/packagesController')

router.get('/packages', (request, response) => packagesController.getPackages(request, response))

router.put('/packages/:packageId', (request, response) => packagesController.updatePackage(request, response))

router.post('/packages', (request, response) => packagesController.addPackage(request, response))

router.delete('/packages/:packageId', (request, response) => packagesController.deletePackage(request, response))

module.exports = router