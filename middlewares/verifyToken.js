const config = require('../config/config')
const jwt = require('jsonwebtoken')

const verifyToken = (request, response, next) => {

    const authHeader = request.headers['token']

    console.log(authHeader)

    if(authHeader) {
        jwt.verify(authHeader, config.SECRETKEY, (error, user) => {
            if(error) response.status(403).json({
                ok: false,
                message: 'token is not valid'
            })

            request.user = user
            next()
        })
    } else {
        return response.status(401).json({
            ok: false,
            message: 'you are not authorized'
        })
    }
}

const verifyUser = (request, response, next) => {

    verifyToken(request, response, () => {
        if(request.user.role == 'USER') {
            return next()
        } else {
            return response.status(403).json({
                ok: false,
                message: 'you are not authorized'
            })
        }
    })
}

const verifyMember = (request, response, next) => {

    verifyToken(request, response, () => {
        if(request.user.role == 'MEMBER') {
            return next()
        } else {
            return response.status(403).json({
                ok: false,
                message: 'you are not authorized'
            })
        }
    })
}

const verifyUserAndAdmin = (request, response, next) => {

    verifyToken(request, response, () => {
        if(request.user.role == 'USER'|| request.user.role == 'ADMIN') {
            return next()
        } else {
            return response.status(403).json({
                ok: false,
                message: 'you are not authorized'
            })
        }
    })
}

const verifyMemberAndAdmin = (request, response, next) => {

    verifyToken(request, response, () => {
        if(request.user.role == 'MEMBER' || request.user.role == 'ADMIN') {
            return next()
        } else {
            return response.status(403).json({
                ok: false,
                message: 'you are not authorized'
            })
        }
    })
}

const verifyAdmin = (request, response, next) => {

    verifyToken(request, response, () => {
        if(request.user.role == 'ADMIN') {
            return next()
        } else {
            return response.status(403).json({
                ok: false,
                message: 'you are not authorized'
            })
        }
    })
}


module.exports = { verifyToken, verifyMember, verifyUser, verifyMemberAndAdmin, verifyUserAndAdmin, verifyAdmin }





