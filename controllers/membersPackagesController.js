const config = require('../config/config')
const packageModel = require('../models/PackageModel')
const userModel = require('../models/UserModel')
const memberPackageModel = require('../models/MembersPackagesModel')
const { isObjectId, isClubValid, isRegistrationMethodValid } = require('../utils/utils')

const addPackage = async (request, response) => {

    try {

        const { club, registrationMethod, packageId, membership } = request.body
        let memberPackage = {}

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

        if(!club) {
            return response.status(406).json({
                ok: false,
                message: 'club name is required',
                field:  'club name'
            })
        }

        if(!isClubValid(club)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid club name',
                field: 'club name'
            })
        }

        if(!registrationMethod) {
            return response.status(406).json({
                ok: false,
                message: 'registration method is required',
                field: 'registration method'
            })
        }

        if(!isRegistrationMethodValid(registrationMethod)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid registration method',
                field: 'registration method'
            })
        }

        if(!membership) {
            return response.status(406).json({
                ok: false,
                message: 'membership is required',
                field: 'membership'
            })
        }

        const memberRegisteredPackages = await memberPackageModel
        .find({ club: club, membership: membership, active: true })

        if(memberRegisteredPackages.length != 0) {
            return response.status(406).json({
                ok: false,
                message: 'this member is already registered in a package'
            })
        }

        memberPackage = { ...memberPackage, packageId, club, registrationMethod, membership }

        if(club != 'sporting') {

            const { memberName, memberPhone, memberMail } = request.body

            if(!memberName) {
                return response.status(406).json({
                    ok: false,
                    message: 'member name is required',
                    field: 'member name'
                })
            }

            if(!memberPhone) {
                return response.status(406).json({
                    ok: false,
                    message: 'member phone is required',
                    field: 'member phone'
                })
            }

            if(!memberMail) {
                return response.status(406).json({
                    ok: false,
                    message: 'member email is required',
                    field: 'member mail'
                })
            }

            memberPackage = { ...memberPackage, memberName, memberPhone, memberMail }

        }

        if(registrationMethod == 'offline') {

            const { userId } = request.body
            const paid = true
            const paymentMethod = 'offline'

            if(!userId) {
                return response.status(406).json({
                    ok: false,
                    message: 'userId Id is required',
                    field: 'userId Id'
                })
            }

            if(!isObjectId(userId)) {
                return response.status(406).json({
                    ok: false,
                    messsage: 'invalid userId Id',
                    field: 'userId Id'
                })
            }

            const user = await userModel.findById(userId)
            if(!user) {
                return response.status(406).json({
                    ok: false,
                    messsage: 'invalid userId Id',
                    field: 'userId Id'
                })
            }

            memberPackage = { ...memberPackage, userId, paid, paymentMethod }
        }


        const registeredPackage = new memberPackageModel(memberPackage)
        const savePackage = await registeredPackage.save()

        return response.status(200).json({
            ok: true,
            memberPackage: savePackage
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

module.exports = { addPackage, searchMember, getClubMembers, updateMemberAttendance }