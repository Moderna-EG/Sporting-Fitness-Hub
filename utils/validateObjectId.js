const mongoose = require('mongoose')

const isObjectId = (objectId) => {
    return mongoose.Types.ObjectId.isValid(objectId)
}

module.exports =  { isObjectId }