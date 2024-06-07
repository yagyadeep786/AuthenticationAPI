const {check}= require("express-validator");

var registerValidator= [
    check("name","name is required").not().isEmpty(),
    check("email","email is required").isEmail().normalizeEmail({
        gmail_remove_dots:true
    }),
    check("password","it is not valid spacial charector").isStrongPassword({
        min:8,
        minUppercase:1,
        minNumbers:1
    }),
    check("image").custom((value,{req})=>{
        if(req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/png"){
            return true;
        }else{
            return false;
        }
    }).withMessage("upload a image in PNG or JPEG formate")
]

var mailVarificationValidator= [
    check("email","email is required").isEmail().normalizeEmail({
        gmail_remove_dots:true
    })
]

var resetPasswordValidator=[
    check("email","email is required").isEmail().normalizeEmail({
        gmail_remove_dots:true
    })
]

module.exports= {
    registerValidator,
    mailVarificationValidator,
    resetPasswordValidator,
}