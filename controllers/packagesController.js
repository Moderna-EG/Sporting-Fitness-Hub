const packageModel = require('../models/PackageModel')

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

module.exports = { getPackages }