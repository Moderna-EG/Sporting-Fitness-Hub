module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    SECRETKEY: process.env.SECRETKEY,
    ALLOWED_CLUBS: ['sporting', 'jazeera', 'saed'],
    REGISTRATION_METHOD: ['online', 'offline'],
    PAYMENT_METHOD: ['cash', 'card'],
    HOST_URL: 'http://167.71.2.138:3002',
    USER_MAIL: process.env.USER_MAIL,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD
}