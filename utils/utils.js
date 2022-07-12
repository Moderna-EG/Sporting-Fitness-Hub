const { isObjectId } = require('./validateObjectId')
const { isClubValid } = require('./validateClub')
const { isRegistrationMethodValid } = require('./validateRegistrationMethod')
const { isPaymentMethodValid } = require('./validatePaymentMethod')
const { isUUIDValid } = require('./validateUUID')

module.exports = { isObjectId, isClubValid, isRegistrationMethodValid, isPaymentMethodValid, isUUIDValid }