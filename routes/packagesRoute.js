const router = require('express').Router()
const packagesController = require('../controllers/packagesController')

router.get('/packages', (request, response) => packagesController.getPackages(request, response))



module.exports = router