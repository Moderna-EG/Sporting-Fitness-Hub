const packageModel = require('../models/PackageModel')
const UserModel = require('../models/UserModel')
const { isObjectId } = require('../utils/validateObjectId')

const getPackages = async (request, response) => {

    try {

        const packages = await packageModel.find().select({ __v: 0, updatedAt: 0 })

        return response.status(200).json({
            ok: true,
            packages: packages
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const addPackage = async (request, response) => {

    try {

        const { title, description, price, attendance, imageURL } = request.body

        if(!title) {
            return response.status(406).json({
                ok: false,
                message: 'title is required',
                field: 'title'
            })
        }

        const usedTitles = await packageModel.find({ title })
        if(usedTitles.length != 0) {
            return response.status(406).json({
                ok: false,
                message: 'title is already used'
            })
        }

        if(!description) {
            return response.status(406).json({
                ok: false,
                message: 'description is required',
                field: 'description'
            })
        }

        if(!price) {
            return response.status(406).json({
                ok: false,
                message: 'price is required',
                field: 'price'
            })
        }

        if(!attendance || attendance == 0) {
            return response.status(406).json({
                ok: false,
                message: 'attendance is required',
                field: 'attendance'
            })
        }

        if(!imageURL) {
            return response.status(406).json({
                ok: false,
                message: 'image is required',
                field: 'image'
            })
        }

        const newPackageData = { title, description, attendance, price, imageURL }

        const package = new packageModel(newPackageData)
        const newPackage = await package.save()

        return response.status(200).json({
            ok: true,
            package: newPackage,
            message: 'package added successfully'
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const updatePackage = async (request, response) => {

    try {

        const { packageId } = request.params
        const { title, description, price, attendance, imageURL } = request.body

        if(!isObjectId(packageId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid package Id'
            })
        }

        if(!title) {
            return response.status(406).json({
                ok: false,
                message: 'title is required',
                field: 'title'
            })
        }

        const usedTitles = await packageModel.find({ title })
        if(usedTitles.length != 0) {
            return response.status(406).json({
                ok: false,
                message: 'title is already used'
            })
        }

        if(!description) {
            return response.status(406).json({
                ok: false,
                message: 'description is required',
                field: 'description'
            })
        }

        if(!price) {
            return response.status(406).json({
                ok: false,
                message: 'price is required',
                field: 'price'
            })
        }

        if(!attendance || attendance == 0) {
            return response.status(406).json({
                ok: false,
                message: 'attendance is required',
                field: 'attendance'
            })
        }

        if(!imageURL) {
            return response.status(406).json({
                ok: false,
                message: 'image is required',
                field: 'image'
            })
        }

        const newPackageData = { title, description, attendance, price, imageURL }

        const updatedPackage = await packageModel.findByIdAndUpdate(packageId, newPackageData, { new: true })

        return response.status(200).json({
            ok: true,
            package: updatedPackage,
            message: 'package updated successfully'
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}

const deletePackage = async (request, response) => {

    try {

        const { packageId } = request.params

        if(!isObjectId(packageId)) {
            return response.status(406).json({
                ok: false,
                message: 'invalid package Id'
            })
        }

        await packageModel.findByIdAndDelete(packageId)

        return response.status(200).json({
            ok: true,
            message: 'package deleted successfully'
        })

    } catch(error) {
        console.error(error)
        return response.status(500).json({
            ok: false,
            message: 'internal server error'
        })
    }
}



module.exports = { getPackages, addPackage, updatePackage, deletePackage }