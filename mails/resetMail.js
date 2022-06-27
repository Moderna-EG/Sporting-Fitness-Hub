const config = require('../config/config')
const nodemailer = require('nodemailer')


const sendResetMail = async (receiverMail, receiverName, receiverId) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'sportingfitnesshub@gmail.com',
          pass: 'chagbxrextwrhbzb'
        }
      })

      var mailOptions = {
        from: 'sportingfitnesshub@gmail.com',
        to: receiverMail,
        subject: 'Password Reset',
        html: `
        <div>
            <p>Hi ${receiverName},</p>
            <p>To reset your password please click <a href=${config.HOST_URL}/reset-password/${receiverId}>Here</a></p>
        </div>
        `
      }


      try {

        await transporter.sendMail(mailOptions)
        return true

      } catch(error) {
        console.error(error)
        return false
      }

    
}

module.exports = { sendResetMail }