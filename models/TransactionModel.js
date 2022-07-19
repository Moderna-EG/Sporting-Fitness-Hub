const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({

    transactionUUID: { type: String, required: true, unique: true },
    memberId: { type: String, required: true }

}, { timestamps: true })

module.exports = mongoose.model('Transaction', TransactionSchema)