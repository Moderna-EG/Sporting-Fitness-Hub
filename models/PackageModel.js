const mongoose = require('mongoose')

const PackageSchema = new mongoose.Schema({

    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    attendance: { type: Number, required: true },
    imageURL: { type: String, required: true }

}, { timestamps: true })

module.exports = mongoose.model('Package', PackageSchema)