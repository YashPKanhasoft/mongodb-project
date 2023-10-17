const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            port: 587,
            secure: true,
            service: 'gmail',
            auth: {
                user: 'yashprajapati.kanhasoft@gmail.com',
                pass: 'quww egfi jjtb betz'
            }
        });

        await transporter.sendMail({
            from: 'yashprajapati.kanhasoft@gmail.com',
            to: email,
            subject: subject,
            html: html
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;