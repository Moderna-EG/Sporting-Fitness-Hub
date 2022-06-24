const config = require('../config/config')

const isPaymentMethodValid = (paymentMethod) => {

    const paymentMethods = config.PAYMENT_METHOD

    for(let i=0;i<paymentMethods.length;i++) {
        if(paymentMethods[i] == paymentMethod) {
            return true
        }
    }

    return false
}

module.exports = { isPaymentMethodValid }