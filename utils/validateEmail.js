
const isEmailValid = (email) => {

    const regularExpression = /\S+@\S+\.\S+/

    return regularExpression.test(email)
}

module.exports = { isEmailValid }