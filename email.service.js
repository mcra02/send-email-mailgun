require('dotenv').config()
const mailgun = require('mailgun-js')({apiKey: process.env.API_KEY, domain: process.env.DOMAIN})

exports.EmailService = {
    sendEmail: async (data) => {

        if(data.email === undefined) throw new Error('Email is not defined!')
        if(data.subject === undefined) throw new Error('Subject is not defined!')
        if(data.message === undefined) throw new Error('Message is not defined!')

        const mailBody = {
            from: `<${process.env.FROM_EMAIL}>`,
            to: `${process.env.EMAILS_TO},${data.email}`,
            subject: data.subject,
            text: data.message
        }

        try {
            await mailgun.messages().send(mailBody)
        } catch (error) {
            console.log(error)
            throw new Error(error.message)
        }

        return {
            mailBody
        }
    }
}
