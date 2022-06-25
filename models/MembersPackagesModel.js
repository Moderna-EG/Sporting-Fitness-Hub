const mongoose = require('mongoose')
const MembersPackagesSchema = new mongoose.Schema({

    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    userId: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    registrationUserId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    active: { type: Boolean, default: true },
    paid: { type: Boolean, default: false },
    paymentMethod: { type: String, default: 'CASH', enum: ['CASH', 'CARD', 'cash', 'card'] },
    registrationMethod: { type: String, required: true, enum: ['ONLINE', 'OFFLINE', 'online', 'offline'] },
    attended: { type: Number, default: 0 },

}, { timestamps: true })

module.exports = mongoose.model('MemberPackage', MembersPackagesSchema)