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

        memberPackage = { ...memberPackage, packageId, club, registrationMethod, membership }

        if(club != 'sporting') {

            const { memberName, memberPhone } = request.body

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

            memberPackage = { ...memberPackage, memberName, memberPhone}

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
        .select({ updatedAt: 0, __v: 0 })
        .sort({ active: 1 })

        return response.status(200).json({
            ok: true,
            member: member
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

module.exports = { addPackage, searchMember }