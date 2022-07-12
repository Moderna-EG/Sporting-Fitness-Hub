const config = require('../config/config')
const { paymentRequest } = require('../api/payment-api')
const createPayment = async (userData, paymentAmount) => {

        const billingData = {
            billing_data: {
                name: userData.username,
                email: userData.email,
                phone_number: userData.phone
            },
            amount: paymentAmount,
            currency: config.PAYMENT.CURRENCY,
            variable_amount_id: config.PAYMENT.VARIABLE_AMOUNT_ID,
            community_id: config.PAYMENT.COMMUNITY_ID,
            membership_id: config.PAYMENT.MEMBERSHIP_ID,
            pay_using: config.PAYMENT.PAY_USING
        }

        const response = await paymentRequest.post('/payments/pay/variable-amount', billingData)

        return response.data
}


module.exports = { createPayment }