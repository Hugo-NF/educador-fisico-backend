const mailjet = require('node-mailjet')
    .connect(process.env.MAILJET_PUBLIC_KEY, process.env.MAILJET_PRIVATE_KEY);

module.exports = {
    async sendEmails(recipients, subject, content, sandboxMode = false) {
        
        mailjet.post("send", {'version': 'v3.1'})
            .request({
                "Messages": [
                    {
                        "From": { "Email": process.env.MAILJET_EMAIL, "Name": process.env.APP_NAME},
                        "To": recipients,
                        "Subject": subject,
                        "HTMLPart": content
                    }
                ],
                "SandboxMode": sandboxMode
            });
        
        return mailjet;
    },
};