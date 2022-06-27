const config = require('../config/config')
const nodemailer = require('nodemailer')


const sendResetMail = async (receiverMail, receiverName, receiverId) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.USER_MAIL,
          pass: config.MAIL_PASSWORD
        }
      })

      var mailOptions = {
        from: config.USER_MAIL,
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