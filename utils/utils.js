const { isObjectId } = require('./validateObjectId')
const { isClubValid } = require('./validateClub')
const { isRegistrationMethodValid } = require('./validateRegistrationMethod')

module.exports = { isObjectId, isClubValid, isRegistrationMethodValid }