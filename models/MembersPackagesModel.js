const mongoose = require('mongoose')
const MembersPackagesSchema = new mongoose.Schema({

    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    memberName: { type: String },
    memberPhone: { type: String },
    membership: { type: Number, required: true },
    club: { type: String, required: true, enum: ['sporting', 'jazeera', 'saed'] },
    active: { type: Boolean, default: true },
    paid: { type: Boolean, default: false },
    paymentMethod: { type: String, default: 'offline', enum: ['offline', 'online'] },
    attended: { type: Number, default: 0 },

}, { timestamps: true })

module.exports = mongoose.model('MemberPackage', MembersPackagesSchema)