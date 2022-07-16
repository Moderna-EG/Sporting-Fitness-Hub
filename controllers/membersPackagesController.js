const config = require('../config/config')
const packageModel = require('../models/PackageModel')
const userModel = require('../models/UserModel')
const memberPackageModel = require('../models/MembersPackagesModel')
const { isObjectId, isClubValid, isRegistrationMethodValid, isPaymentMethodValid, isUUIDValid } = require('../utils/utils')
const UserModel = require('../models/UserModel')
const mongoose = require('mongoose')
const payment = require('../payment/x-pay')

const getRegisteredPackages = async (request, response) => {

    try {

        const registeredPackages = await memberPackageModel.aggregate([
            {
                $lookup: { from: 'packages', localField: 'packageId', foreignField: '_id', as: 'package' }
            },
            {
                $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'member' }
            },
            {
                $lookup: { from: 'users', localField: 'registrationUserId', foreignField: '_id', as: 'user' }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: { __v: 0, updatedAt: 0, packageId: 0 }
            }
        ])

        return response.status(200).json({
            ok: true,
            registeredPackages
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const deleteRegisteredPackage = async (request, response) => {

    try {

        const { memberPackageId } = request.params

        if(!isObjectId(memberPackageId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid registered package Id'
            })
        }

        await memberPackageModel.findByIdAndDelete(memberPackageId)

        return response.status(200).json({
            ok: true,
            message: 'member package deleted successfully'
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}


const getMemberRegisteredPackages = async (request, response) => {

    try {

        const { memberId } = request.params

        if(!isObjectId(memberId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid member Id'
            })
        }

        const memberPackages = await memberPackageModel
        .aggregate([
            { $match: { userId: mongoose.Types.ObjectId(memberId) }},
            { $lookup: { from: 'packages', localField: 'packageId', foreignField: '_id', as: 'package' }},
            { $sort: { active: -1 }},
            { $project: { __v: 0, updatedAt: 0, packageId: 0 }}
        ])

        return response.status(200).json({
            ok: true,
            memberPackages: memberPackages
        })


    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}
const registerOfflinePackage = async (request, response) => {

    try {

        const { packageId, userId, registrationUserId } = request.body
        let memberPackage = {}

        const usedMemberPackages = await memberPackageModel.find({ userId, active: true })
        if(usedMemberPackages.length != 0) {
            return response.status(406).json({
                ok: false,
                message: 'already registered in a package'
            })
        }

        if(!userId) {
            return response.status(406).json({
                ok: false,
                message: 'user Id is required',
                field: 'user Id'
            })
        }

        if(!isObjectId(userId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid user Id',
                field: 'user Id'
            })
        }

        const user = await userModel.find({ _id: userId, role: 'MEMBER' })
        if(user.length == 0) {
            return response.status(406).json({
                ok: false,
                message: 'invalid user Id',
                field: 'registration user Id'
            })
        }

        if(!packageId) {
            return response.status(406).json({
                ok: false,
                message: 'package Id is required',
                field: 'package Id'
            })
        }

        if(!isObjectId(packageId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid package Id',
                field: 'package Id'
            })
        }

        const package = await packageModel.findById(packageId)
        if(!package) {
            return response.status(406).json({
                ok: false,
                message: 'invalid package Id',
                field: 'package Id'
            })
        }

        if(!registrationUserId) {
            return response.status(406).json({
                ok: false,
                message: 'registration user Id is required',
                field: 'registration user Id'
            })
        }

        if(!isObjectId(registrationUserId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid registration user Id',
                field: 'registration user Id'
            })
        }

        const registrationUser = await userModel.find({ _id: registrationUserId, role: 'USER' })
        if(registrationUser.length == 0) {
            return response.status(406).json({
                ok: false,
                message: 'invalid registration user Id',
                field: 'registration user Id'
            })
        }


        memberPackage = { packageId, userId, registrationUserId, registrationMethod: 'offline', paymentMethod: 'cash',  paid: true }

        const registerPackage = new memberPackageModel(memberPackage)
        const savedPackageDetails = await registerPackage.save()

        return response.status(200).json({
            ok: true,
            registeredPackage: savedPackageDetails,
            message: 'registered package successfully'
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const registerOnlinePackage = async (request, response) => {

    try {

        const { packageId, userId, paymentMethod } = request.body
        let memberPackage = {}

        if(!userId) {
            return response.status(406).json({
                ok: false,
                message: 'user Id is required',
                field: 'user Id'
            })
        }

        if(!isObjectId(userId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid user Id',
                field: 'user Id'
            })
        }

        const user = await userModel.find({ _id: userId, role: 'MEMBER' })
        if(user.length == 0) {
            return response.status(406).json({
                ok: false,
                message: 'invalid user Id',
                field: 'user Id'
            })
        }

        const registeredPackages = await memberPackageModel.find({ userId: userId, active: true })

        if(registeredPackages.length != 0) {
            return response.status(406).json({
                ok: false,
                message: 'already registered in a package'
            })
        }

        if(!packageId) {
            return response.status(406).json({
                ok: false,
                message: 'package Id is required',
                field: 'package Id'
            })
        }

        if(!isObjectId(packageId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid package Id',
                field: 'package Id'
            })
        }

        const package = await packageModel.findById(packageId)
        if(!package) {
            return response.status(406).json({
                ok: false,
                message: 'invalid package Id',
                field: 'package Id'
            })
        }

        if(!paymentMethod) {
            return response.status(406).json({
                ok: false,
                message: 'payment method is required',
                field: 'payment method'
            })
        }

        if(!isPaymentMethodValid(paymentMethod)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid payment method',
                field: 'payment method'
            })
        }

        let paid = false
        if(paymentMethod == 'card') {

            const PAYMENT_AMOUNT = package.price
            const userData = {
                username: user[0].username,
                email: user[0].email,
                phone: user[0].phone
            }

            const transaction = await payment.createPayment(userData, PAYMENT_AMOUNT)

            if(!transaction) {
                return response.status(406).json({
                    ok: false,
                    message: 'failed to process your transaction'
                })
            }

            memberPackage = { ...memberPackage, transaction }

            paid = true
            
        } else {
            paid = false
        }

        memberPackage = { ...memberPackage, packageId, userId, registrationMethod: 'online', paymentMethod,  paid }

        const registerPackage = new memberPackageModel(memberPackage)
        const savedPackageDetails = await registerPackage.save()

        return response.status(200).json({
            ok: true,
            registeredPackage: savedPackageDetails,
            message: 'registered package successfully'
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const payOnline = async (request, response) => {

    try {

        const { memberId } = request.params
        const { paymentAmount } = request.body

        if(!isObjectId(memberId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid member Id'
            })
        }

        const member = await userModel.findById(memberId)

        if(!member) {
            return response.status(406).json({
                ok: false,
                message: 'invalid member Id'
            })
        }

        if(!paymentAmount) {
            return response.status(406).json({
                ok: false,
                message: 'payment amount is required',
                field: 'paymentAmount'
            })
        }

        const memberData = { 
            username: member.username,
            email: member.email,
            phone: member.phone
        }

        const transaction = await payment.createPayment(memberData, paymentAmount)

        return response.status(200).json(transaction.data)

    } catch(error) {
        console.error(error.response.data)
        return response.status(500).json({
            ok: false,
            message: 'error processing the payment'
        })
    }
}

const checkTransaction = async (request, response) => {

    try {

        const { transactionUUID } = request.params

        if(!isUUIDValid(transactionUUID)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid transaction UUID'
            })
        }


        return response.status(200).json({
            ok: true,
            message: 'done'
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const updateMemberPaid = async (request, response) => {

    try {

        const { memberPackageId } = request.params

        if(!isObjectId(memberPackageId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid member package Id'
            })
        }

        const checkMemberPackage = await memberPackageModel.findById({ _id: memberPackageId })

        if(!checkMemberPackage) {
            return response.status(406).json({
                ok: false,
                message: 'no registered package with that Id'
            })
        }

        if(checkMemberPackage.paid) {
            return response.status(406).json({
                ok: false,
                message: 'member already paid for this package'
            })
        }

        const memberPackage = await memberPackageModel
        .findByIdAndUpdate(memberPackageId, { paid:  true }, { new: true })

        return response.status(200).json({
            ok: true,
            memberPackage
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const searchMember = async (request, response) => {

    try {

        const qClub = request.query.club
        const qMembership = request.query.membership

        const member = await memberPackageModel
        .find({ club: qClub, membership: qMembership })
        .limit(1)
        .select({ memberName: 1, membership: 1, club: 1, memberPhone: 1, _id: 0, memberMail: 1 })

        const memberPackages = await memberPackageModel
        .find({ club: qClub, membership: qMembership })
        .select({ updatedAt: 0, __v: 0, memberName: 0, memberPhone: 0, membership: 0, club: 0, memberMail: 0 })
        .sort({ active: 1 })

        return response.status(200).json({
            ok: true,
            member: member[0],
            packages: memberPackages
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const getClubMembers = async (request, response) => {

    try {

        const members = await memberPackageModel
        .aggregate([
            { $match: { club: request.params.club } },
            { $project: { memberName: 1, memberPhone: 1, membership: 1, club: 1, memberMail: 1 } }
        ])

        return response.status(200).json({
            ok: true,
            members: members
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const updateMemberAttendance = async (request, response) => {

    try {

        const { registeredPackageId } = request.params

        if(!isObjectId(registeredPackageId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid registered package Id'
            })
        }

        const memberRegisteredPackage = await memberPackageModel.find({ _id: registeredPackageId })

        if(memberRegisteredPackage.length == 0) {
            return response.status(406).json({
                ok: false,
                message: 'no registered package with that Id'
            })
        }

        const memberPackage = memberRegisteredPackage[0]

        if(memberPackage.paid == false) {
            return response.status(406).json({
                ok: false,
                message: 'this package is not paid, cannot update attendance'
            })
        }

        const packageData = await packageModel.find({ _id: memberPackage.packageId })

        const package = packageData[0]

       if(memberPackage.attended == package.attendance) {
           return response.status(406).json({
               ok: false,
               message: 'you attended all the sessions of this package'

           })
       }

       const NEW_SESSION = 1
       let updatedFields = { attended: memberPackage.attended + NEW_SESSION, active: true }

       if((memberPackage.attended + NEW_SESSION) == package.attendance) {
           updatedFields.active = false
       }    

       const updatedMemberPackage = await memberPackageModel
       .findOneAndUpdate({ _id: registeredPackageId }, updatedFields, { new: true })

        return response.status(200).json({
            ok: true,
            memberPackage: updatedMemberPackage
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const checkMemberRegistration = async (request, response) => {

    try {

        const { memberId } = request.params

        if(!isObjectId(memberId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid member Id'
            })
        }

        const memberPackage = await memberPackageModel.find({ userId: memberId, active: true })

        if(memberPackage.length != 0) {
            return response.status(406).json({
                ok: false,
                message: 'member already registered in a package'
            })
        }


        return response.status(200).json({
            ok: true,
            message: 'member is not registered in a package'
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

module.exports = {
    getRegisteredPackages,
    registerOfflinePackage, 
    registerOnlinePackage, 
    searchMember, 
    getClubMembers, 
    updateMemberAttendance,
    getMemberRegisteredPackages,
    deleteRegisteredPackage,
    updateMemberPaid,
    payOnline,
    checkTransaction,
    checkMemberRegistration
 }