const nodemailer = require("nodemailer");
const APIError = require("./errors");

const sendEmail = async (mailOptions) => {
    const transporter = await nodemailer.createTransport({
        host:"smtp-mail.outlook.com",
        port:587,
        secure:false,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    })
    await transporter.sendEmail(mailOptions,(error,info) => {
        if(error){
            console.log("Hata cikti gonderilemedi: " + error);
            throw new APIError("Could not send email")
        }
        console.log("check info");
        console.log("info "+ info);
        console.log("check info1");

        return true;
        
    })
};

module.exports = sendEmail;