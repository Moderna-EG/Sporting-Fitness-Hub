const { isObjectId } = require('./validateObjectId')
const { isClubValid } = require('./validateClub')
const { isRegistrationMethodValid } = require('./validateRegistrationMethod')
const { isPaymentMethodValid } = require('./validatePaymentMethod')
const { isUUIDValid } = require('./validateUUID')
const { isPhoneValid } = require('./validatePhone')
const { isUsernameValid } = require('./validateUsername')
const { isEmailValid } = require('./validateEmail')
const { isMembershipValid } = require('./validateMembership')

module.exports = { 
    isObjectId, 
    isClubValid, 
    isRegistrationMethodValid, 
    isPaymentMethodValid, 
    isUUIDValid,
    isPhoneValid,
    isUsernameValid,
    isEmailValid,
    isMembershipValid
}