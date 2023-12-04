const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // Define the email options
    const emailOptions = {
        from: '',
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    transporter.sendMail(emailOptions)
}

module.exports = sendEmail;
