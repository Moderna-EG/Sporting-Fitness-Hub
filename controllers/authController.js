const userModel = require('../models/UserModel')
const userJWT = require('jsonwebtoken')
const config = require('../config/config')
const { isClubValid, isObjectId } = require('../utils/utils')
const { sendResetMail } = require('../mails/resetMail')

const userLogin = async (request, response) => {

    try {


        if(!request.body.email) {
            return response.status(406).json({
                ok: false,
                message: 'email is required'
            })
        }

        if(!request.body.password) {
            return response.status(406).json({
                ok: false,
                message: 'password is required'
            })
        }

        const user = await userModel.find({ email: request.body.email, role: 'USER' }).select({ __v: 0, updatedAt: 0 })

        if(user.length == 0) {
            return response.status(406).json({
                ok: false,
                message: `email doesn't exist`
            })
        }

        if(user[0].password != request.body.password) {
            return response.status(406).json({
                ok: false,
                message: 'wrong password'
            })
        }

        const accessToken = userJWT.sign(
            { userId: user[0]._id, role: user[0].role },
            config.SECRETKEY,
            { expiresIn: '30d' }
            )

        user[0].password = ''

        return response.status(200).json({
            ok: true,
            user: user[0],
            accessToken: accessToken
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}


const userSignUp = async (request, response) => {

    try {

        const { username, email, password, phone, club, membership } = request.body

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
                message: 'email is already used'
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
            password,
            phone,
            role: 'USER'
        }

        const User = new userModel(user)
        const savedUser = await User.save()

        savedUser.password = ''
        savedUser.updatedAt = ''
        savedUser.__v = ''

        const accessToken = userJWT.sign(
            { user: savedUser },
            config.SECRETKEY,
            { expiresIn: '30d' }
        )

        return response.status(200).json({
            ok: true,
            user: savedUser,
            message: 'user added successfully!',
            accessToken: accessToken
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const memberLogin = async (request, response) => {

    try {

        if(!request.body.email) {
            return response.status(406).json({
                ok: false,
                message: 'email is required'
            })
        }

        if(!request.body.password) {
            return response.status(406).json({
                ok: false,
                message: 'password is required'
            })
        }

        const member = await userModel.find({ email: request.body.email, role: 'MEMBER' }).select({ __v: 0, updatedAt: 0 })

        if(member.length == 0) {
            return response.status(406).json({
                ok: false,
                message: `email doesn't exist`
            })
        }

        if(member[0].password != request.body.password) {
            return response.status(406).json({
                ok: false,
                message: 'wrong password'
            })
        }

        const accessToken = userJWT.sign(
            { user: member[0] },
            config.SECRETKEY,
            { expiresIn: '30d' }
            )

            member[0].password = ''

        return response.status(200).json({
            ok: true,
            user: member[0],
            accessToken: accessToken
        })
    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const memberSignUp = async (request, response) => {

    try {

        const { username, email, password, phone, club, membership } = request.body

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
                message: 'email is already used'
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
                message: 'phone must be 11 numbers'
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

        if(!club) {
            return response.status(406).json({
                ok: false,
                message: 'club is required',
                field: 'club'
            })
        }

        if(!isClubValid(club)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid club',
                field: 'club'
            })
        }

        if(!membership) {
            return response.status(406).json({
                ok: false,
                message: 'membership is required',
                field: 'membership'
            })
        }

        const usedMemberships = await userModel.find({ club: club, membership: membership })
        if(usedMemberships.length != 0) {
            return response.status(406).json({
                ok: false,
                message: 'membership is already used',
                field: 'membership'
            })
        }

        const user = {
            username,
            email,
            password,
            phone,
            role: 'MEMBER',
            club,
            membership
        }

        const User = new userModel(user)
        const savedUser = await User.save()

        savedUser.password = ''
        savedUser.updatedAt = ''
        savedUser.__v = ''

        const accessToken = userJWT.sign(
            { user: savedUser },
            config.SECRETKEY,
            { expiresIn: '30d' }
        )

        return response.status(200).json({
            ok: true,
            user: savedUser,
            message: 'user added successfully!',
            accessToken: accessToken
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const adminSignUp = async (request, response) => {

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
                message: 'email is already used'
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
            password,
            phone,
            role: 'ADMIN'
        }

        const User = new userModel(user)
        const savedUser = await User.save()

        savedUser.password = ''
        savedUser.updatedAt = ''
        savedUser.__v = ''

        const accessToken = userJWT.sign(
            { user: savedUser },
            config.SECRETKEY,
            { expiresIn: '30d' }
        )

        return response.status(200).json({
            ok: true,
            user: savedUser,
            message: 'admin added successfully!',
            accessToken: accessToken
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const adminLogin = async (request, response) => {

    try {

        if(!request.body.email) {
            return response.status(406).json({
                ok: false,
                message: 'email is required',
                field: 'email'
            })
        }

        if(!request.body.password) {
            return response.status(406).json({
                ok: false,
                message: 'password is required',
                field: 'password'
            })
        }

        const member = await userModel.find({ email: request.body.email, role: 'ADMIN' }).select({ __v: 0, updatedAt: 0 })

        if(member.length == 0) {
            return response.status(406).json({
                ok: false,
                message: `email doesn't exist`,
                field: 'email'
            })
        }

        if(member[0].password != request.body.password) {
            return response.status(406).json({
                ok: false,
                message: 'wrong password',
                field: 'password'
            })
        }

        const accessToken = userJWT.sign(
            { user: member[0] },
            config.SECRETKEY,
            { expiresIn: '30d' }
            )

            member[0].password = ''

        return response.status(200).json({
            ok: true,
            user: member[0],
            accessToken: accessToken
        })
    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const resetEmail = async (request, response) => {

    try {

        const { email } = request.params

        if(!email) {
            return response.status(406).json({
                ok: false,
                message: 'email is required',
                field: 'email'
            })
        }

        const usedEmails = await userModel.find({ email })
        if(usedEmails.length == 0) {
            return response.status(406).json({
                ok: false,
                message: `account doesn't exist`,
                field: 'email'
            })
        }

        const isSent = await sendResetMail(email, usedEmails[0].username, usedEmails[0]._id)

        if(!isSent) {
            return response.status(406).json({
                ok: false,
                message: `couldn't send the email`
            })
        }

        return response.status(200).json({
            ok: true,
            message: 'mail sent successfully'
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const resetPassword = async (request, response) => {

    try {

        const { userId } = request.params
        const { newPassword } = request.body

        if(!isObjectId(userId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid user Id',
                field: 'userId'
            })
        }

        if(!newPassword) {
            return response.status(406).json({
                ok: false,
                message: 'new password is required',
                field: 'new password'
            })
        }

        await userModel.findByIdAndUpdate(userId, { password: newPassword })
        

        return response.status(200).json({
            ok: true,
            message: 'password reset successfully'
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

module.exports = { userLogin, userSignUp, memberLogin, memberSignUp, adminSignUp, adminLogin, resetEmail, resetPassword }