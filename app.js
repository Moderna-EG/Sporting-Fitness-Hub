const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv').config()
const config = require('./config/config')
const cors = require('cors')
const DB = require('./config/db').connect()

const app = express()

// Middlewares

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())

// Routes

app.use('/api', require('./routes/authRoute'))
app.use('/api', require('./routes/packagesRoute'))
app.use('/api', require('./routes/membersPackagesRoute'))
app.use('/api', require('./routes/usersRoute'))

app.get('/', (request, response) => {
    return response.status(200).send('Received with love')
})

app.listen(config.PORT, () => console.log(`server started on port ${config.PORT}`))