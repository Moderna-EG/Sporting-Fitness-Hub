const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv').config()
const config = require('./config/config')
const DB = require('./config/db').connect()

const app = express()

app.use(morgan('dev'))
app.use(bodyParser.json())

app.use('/api', require('./routes/authRoute'))

app.get('/', (request, response) => {
    return response.status(200).send('Received with love')
})

app.listen(config.PORT, () => console.log(`server started on port ${config.PORT}`))