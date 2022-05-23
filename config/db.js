const mongoose = require('mongoose')
const config = require('../config/config')

const connect = () => {
    mongoose.connect(config.DB_URL)
    .then(() => console.log(`connected to the database server`))
    .catch(error => console.error(error))
}

module.exports = { connect }