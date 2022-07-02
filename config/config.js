module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    SECRETKEY: process.env.SECRETKEY,
    ALLOWED_CLUBS: ['sporting', 'jazeera', 'saed'],
    REGISTRATION_METHOD: ['online', 'offline'],
    PAYMENT_METHOD: ['cash', 'card'],
    HOST_URL: 'http://167.71.2.138:3002',
    USER_MAIL: process.env.USER_MAIL,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    BCRYPT_ROUNDS: 7,

    PAYMENT: {
        API_KEY: process.env.PAYMENT_API_KEY,
        CURRENCY: process.env.PAYMENT_CURRENCY,
        VARIABLE_AMOUNT_ID: process.env.PAYMENT_VARIABLE_AMOUNT_ID,
        COMMUNITY_ID: process.env.PAYMENT_COMMUNITY_ID,
        MEMBERSHIP_ID: process.env.PAYMENT_MEMBERSHIP_ID,
        PAY_USING: process.env.PAYMENT_PAY_USING
    }
}