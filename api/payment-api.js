const axios = require('axios')
const config = require('../config/config')

const paymentRequest = axios.create({
    baseURL: 'https://staging.xpay.app/api/v1',
    headers: {
        'x-api-key': config.PAYMENT.API_KEY
    }
})

module.exports = { paymentRequest }