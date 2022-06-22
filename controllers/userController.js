const userModel = require('../models/UserModel')

const getUsers = async (request, response) => {

    try {

        const users = await userModel.find().select({ __v: 0, updatedAt: 0 })

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
                message: 'phone is already used'
            })
        }

        const user = {
            username,
            email,
            password,
            phone
        }

        const User = new userModel(user)
        const savedUser = await User.save()

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

module.exports = {
    getUsers,
    addUser
}