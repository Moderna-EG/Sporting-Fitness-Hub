const mongoose = require('mongoose')
const db = require('./models/PackageModel')

mongoose.connect('mongodb://localhost/sporting-fitness-hub')
    .then(() => console.log(`connected to the database server`))
    .catch(error => console.error(error))

const package1 = new db({
    title: `Compete`,
    description: `Updates on the latest events and how to prepare for your own competition.`,
    price: 200,
    attendance: 1,
    imageURL: 'https://cdn.shopify.com/s/files/1/0471/3332/7519/files/compete.jpg'
}).save()

const package2 = new db({
    title: `Gain Strength`,
    description: `Get stronger, make progress and crush your old PR.`,
    price: 500,
    attendance: 5,
    imageURL: 'https://cdn.shopify.com/s/files/1/0471/3332/7519/files/gain-strength.jpg'
}).save()

