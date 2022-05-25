const config = require('../config/config')

const isRegistrationMethodValid = (method) => {

    const validMethods = config.REGISTRATION_METHOD

    for(let i=0;i<validMethods.length;i++) {
        if(validMethods[i] == method) {
            return true
        }
    }
    return false
}

module.exports = { isRegistrationMethodValid }