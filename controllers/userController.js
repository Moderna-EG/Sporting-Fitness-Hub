const userModel = require('../models/UserModel')
const { isClubValid, isObjectId } = require('../utils/utils')
const bcrypt = require('bcrypt')
const config = require('../config/config')

const getUsers = async (request, response) => {

    try {

        const users = await userModel
        .find({ role: 'USER' })
        .sort({ createdAt: -1 })
        .select({ __v: 0, updatedAt: 0, password: 0 })

        return response.status(200).json({
            ok: true,
            users
        })
        

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const addUser = async (request, response) => {

    try {

        const { username, email, password, phone } = request.body

        if(!username) {
            return response.status(406).json({
                ok: false,
                message: 'username is required',
                field: 'username'
            })
        }
        if(!email) {
            return response.status(406).json({
                ok: false,
                message: 'email is required',
                field: 'email'
            })
        }
        const usedEmail = await userModel.find({ email: email })
        if(usedEmail.length != 0) {
            return response.status(406).json({
                ok: false,
                message: 'email is already used',
                field: 'email'
            })
        }

        if(!password) {
            return response.status(406).json({
                ok: false,
                message: 'password is required',
                field: 'password'
            })
        }

        if(!phone) {
            return response.status(406).json({
                ok: false,
                message: 'phone is required',
                field: 'phone'
            })
        }

        if(phone.length != 11) {
            return response.status(406).json({
                ok: false,
                message: 'phone number must be 11 numbers',
                field: 'phone'
            })
        }

        const usedPhone = await userModel.find({ phone: phone })
        if(usedPhone.length != 0) {
            return response.status(406).json({
                ok: false,
                message: 'phone is already used',
                field: 'phone'
            })
        }
        const user = {
            username,
            email,
            password: bcrypt.hashSync(password, config.BCRYPT_ROUNDS),
            phone,
            role: 'USER'
        }

        const User = new userModel(user)
        const savedUser = await User.save()

        savedUser.password = ''
        savedUser.updatedAt = ''
        savedUser.__v = ''

        return response.status(200).json({
            ok: true,
            user: savedUser,
            message: 'user added successfully!'
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const updateUser = async (request, response) => {

    try {

        const { userId } = request.params
        const { username, email, phone } = request.body

        if(!isObjectId(userId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid user Id'
            })
        }

        const userData = await userModel.findById(userId)
        if(!userData) {
            return response.status(406).json({
                ok: false,
                message: 'invalid user Id'
            })
        }

        if(!username) {
            return response.status(406).json({
                ok: false,
                message: 'username is required'
            })
        }

        if(!email) {
            return response.status(406).json({
                ok: false,
                message: 'email is required'
            })
        }

        const usedEmails = await userModel.find({ email })
        if(usedEmails.length != 0) {
            return response.status(406).json({
                ok: false,
                message: 'email is already taken'
            })
        }

        if(!phone) {
            return response.status(406).json({
                ok: false,
                message: 'phone is required'
            })
        }

        if(phone.length != 11) {
            return response.status(406).json({
                ok: false,
                message: 'phone must be 11 numbers'
            })
        }

        const usedPhones = await userModel.find({ phone })
        if(usedPhones.length != 0) {
            return response.status(406).json({
                ok: false,
                message: 'phone is already taken'
            })
        }

        const newUserData = {
            username,
            email,
            phone,
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, newUserData, { new: true })

        updatedUser.password = ''
        updatedUser.updatedAt = ''
        updatedUser.__v = ''

        return response.status(200).json({
            ok: true,
            updatedUser
        })


    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const deleteUser = async (request, response) => {

    try {

        const { userId } = request.params

        if(!isObjectId(userId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid user Id'
            })
        }

        await userModel.findByIdAndDelete(userId)

        return response.status(200).json({
            ok: true,
            message: 'user deleted successfully'
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

        const { club } = request.params

        const clubMembers = await userModel
        .find({ club: club })
        .select({ __v: 0, updatedAt: 0, password: 0 })

        return response.status(200).json({
            ok: true,
            clubMembers: clubMembers
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const getByMembership = async (request, response) => {

    try {

        const { club, membership } = request.params

        const member = await userModel
        .findOne({ club, membership })
        .sort({ createdAt: -1 })
        .select({ __v: 0, updatedAt: 0, password: 0 })

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

const getMembers = async (request, response) => {

    try {

        const members = await userModel
        .find({ role: 'MEMBER' })
        .sort({ createdAt: -1 })
        .select({ password: 0, updatedAt: 0, __v: 0 })

        return response.status(200).json({
            ok: true,
            members
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const deleteMember = async (request, response) => {

    try {

        const { memberId } = request.params

        if(!isObjectId(memberId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid member Id'
            })
        }

        await userModel.findByIdAndDelete(memberId)

        return response.status(200).json({
            ok: true,
            message: 'member deleted successfully'
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
    getUsers,
    getClubMembers,
    getByMembership,
    updateUser,
    deleteUser,
    addUser,
    getMembers,
    deleteMember
}