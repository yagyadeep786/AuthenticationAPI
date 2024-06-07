const nodemailer= require("nodemailer");

const transpotor= nodemailer.createTransport({
    service:"gmail",
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:false,
    requireTLS:true,
    auth:{
        user:process.env.SMTP_MAIL,
        pass:process.env.SMTP_PASSWORD
    }
});



const sendMail= async(email,subject,content)=>{
    try{
        var mailOptions= {
            from:process.env.SMTP_MAIL,
            to:email,
            subject:subject,
            html:content,
        }

        transpotor.sendMail(mailOptions,(error,info)=>{
            if(error){
                console.log(error);
                return;
            }

            console.log("send mail succefully ",info.messageId);
        })

    }catch(err){
        console.log(err);
    }
}


module.exports= {
    sendMail,
}