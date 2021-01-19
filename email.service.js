require('dotenv').config()
const mailgun = require('mailgun-js')({apiKey: process.env.API_KEY, domain: process.env.DOMAIN})

exports.EmailService = {
    sendEmail: async (data) => {

        console.log(data.from)

        if(data.from === undefined) throw new Error('From is not defined!')
        if(data.subject === undefined) throw new Error('Subject is not defined!')
        // if(data.message === undefined) throw new Error('Message is not defined!')
        if(data.to === undefined) throw new Error('Message is not defined!')

        // const to = process.env.EMAILS_TO ? `${process.env.EMAILS_TO},${data.email}`: `${data.email}`


        const mailBody = {
            from: `<${process.env.FROM_EMAIL}>`,
            to: data.to,
            subject: `${data.subject} FROM ${data.from}`,
            text: data.message,
            html: data.html,
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
