const { isObjectId } = require('./validateObjectId')
const { isClubValid } = require('./validateClub')
const { isRegistrationMethodValid } = require('./validateRegistrationMethod')
const { isPaymentMethodValid } = require('./validatePaymentMethod')
const { isUUIDValid } = require('./validateUUID')
const { isPhoneValid } = require('./validatePhone')
const { isUsernameValid } = require('./validateUsername')

module.exports = { 
    isObjectId, 
    isClubValid, 
    isRegistrationMethodValid, 
    isPaymentMethodValid, 
    isUUIDValid,
    isPhoneValid,
    isUsernameValid
}