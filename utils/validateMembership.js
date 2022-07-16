
const isMembershipValid = (membership) => {

    const numbers = '0123456789'

    for(let i=0;i<membership.length;i++) {

        let validNumber = false

        for(let j=0;j<numbers.length;j++) {
           if(membership[i] == numbers[j]) {
            validNumber = true
            break
           } 
        }

        if(validNumber == false) {
            return false
        }
    }

    return true
}

module.exports = { isMembershipValid }