const { isObjectId } = require('./validateObjectId')
const { isClubValid } = require('./validateClub')
const { isRegistrationMethodValid } = require('./validateRegistrationMethod')
const { isPaymentMethodValid } = require('./validatePaymentMethod')

module.exports = { isObjectId, isClubValid, isRegistrationMethodValid, isPaymentMethodValid }