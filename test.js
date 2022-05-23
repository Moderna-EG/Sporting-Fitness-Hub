const mongoose = require('mongoose')
const db = require('./models/User')

mongoose.connect('mongodb://localhost/sporting-fitness-hub')
    .then(() => console.log(`connected to the database server`))
    .catch(error => console.error(error))

const user = new db({
    email: 'omar@gmail.com',
    password: 'omar77',
    username: 'Omar Reda',
    role: 'USER'
}).save()

console.log(user)