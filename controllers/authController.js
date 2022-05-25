const userModel = require('../models/UserModel')
const userJWT = require('jsonwebtoken')
const config = require('../config/config')


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

        const user = await userModel.find({ email: request.body.email }).select({ __v: 0, updatedAt: 0 })

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

module.exports = { userLogin }