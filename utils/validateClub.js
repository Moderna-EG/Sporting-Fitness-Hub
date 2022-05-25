const config = require('../config/config')

const isClubValid = (clubName) => {

    const clubs = config.ALLOWED_CLUBS

    for(let i=0;i<clubs.length;i++) {
        if(clubs[i] == clubName) {
            return true
        }
    }

    return false
}

module.exports = { isClubValid }