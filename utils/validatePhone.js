
const isPhoneValid = (phoneNumber) => {

    const numbers = '0123456789'

    for(let i=0;i<phoneNumber.length;i++) {

        let validNumber = false

        for(let j=0;j<numbers.length;j++) {
           if(phoneNumber[i] == numbers[j]) {
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

module.exports = { isPhoneValid }