const mailjet = require('node-mailjet')
    .connect(process.env.MAILJET_PUBLIC_KEY, process.env.MAILJET_PRIVATE_KEY);

module.exports = {
    async sendSingleEmail(recipient, recipientName,subject, text) {
        
        mailjet.post("send", {'version': 'v3.1'})
            .request({
                "Messages": [
                    {
                        "From": { "Email": process.env.MAILJET_EMAIL, "Name": "Hugo Dev"},
                        "To": [
                            { "Email": recipient, "Name": recipientName }
                        ],
                        "Subject": subject,
                        "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!"
                    }
                ]
            })
        
        return mailjet;
    }
};