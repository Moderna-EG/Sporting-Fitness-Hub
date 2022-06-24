module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.DB_URL,
    SECRETKEY: process.env.SECRETKEY,
    ALLOWED_CLUBS: ['sporting', 'jazeera', 'saed'],
    REGISTRATION_METHOD: ['online', 'offline'],
    PAYMENT_METHOD: ['cash', 'card']
}