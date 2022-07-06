const nodemailer = require("nodemailer"),
    {nodemailer: nodemailerSecret} = require('../config/secrets.json')

let transporter = nodemailer.createTransport({
    service: nodemailerSecret.smtp,
    port: nodemailerSecret.port,
    secure: true,
    debug: true,
    auth: {
        user: nodemailerSecret.email,
        pass: nodemailerSecret.password,
    },
});

module.exports = async(toMail, subject, body) => {
    try {
        let info = await transporter.sendMail({
            from: 'contact@bookbank.com',
            to: toMail,
            subject: subject,
            html: body,
        });

        return info;
    } catch (error) {
        console.log("email error:",error)
    }
}