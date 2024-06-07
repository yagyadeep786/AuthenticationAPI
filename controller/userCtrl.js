const userModel= require("../models/userModel");
const bcrypt= require("bcrypt");
const {validationResult} = require("express-validator");
const mailer= require("../helper/mailer");
const randomString= require("randomstring");
const resetPasswordModel= require("../models/resetPasswordModel");
const jwt= require("jsonwebtoken");
const path= require("path");
const deleteFile= require("../helper/deleteFile")
const blackListTokenModel= require("../models/blacklistTokenModel");
const otpModel= require("../models/otpModel");
const {oneMiniutExpiry,otpExpire} = require("../helper/otpValidator")
const twilio= require("twilio");
const mobileOtpModel= require("../models/mobileOtpModel");

const userRegistor= async(req,res)=>{

    // first check the user is present or not
  
    try{
        // console.log(req.file);
        // let errors= validationResult(req);
        // if(!errors.isEmpty()){
        //     return res.status(400).json({
        //         success:false,
        //         msg:"Errors",
        //         errors:errors.array()
        //     });
        // }
        let isExist= await userModel.findOne({email:req.body.email});
        if(isExist){
            return res.status(400).json({
                msg:"email alrady exitst"
            })
        }
        let salt= bcrypt.genSaltSync(10);
        let hashPass=  bcrypt.hashSync(req.body.password,salt);
        let newUser= new userModel({
            name:req.body.name,
            email:req.body.email,
            password:hashPass,
            mobile_number:req.body.mobile_number,
            // image:"images/"+req.file.filename
        });

        console.log(newUser);
        let saveUser= await newUser.save();
        let msg= `<p1>This is verificatin email , please varify your email by clicking on the url </br>
        <a href="${process.env.BASE_URL}/mail-varification?user_id=${newUser._id}">
        ${process.env.BASE_URL}/mail-varification?user_id=${newUser._id}
        </a>
        </p>`;

        mailer.sendMail(req.body.email,"Mail Varification",msg);

        return res.status(200).json({
            msg:"user register successfully",
            userData:saveUser
        })
    }
    catch(err){
        res.status(400).json({
            mag:"there is some problem",
            err:err.message
        })
    }
}


const mailVarification= async(req,res)=>{
    try{
        let errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                msg:"Errors",
                errors:errors.array()
            });
        }

        let email= req.body.email;
        // check email-> exit
       let userData= await userModel.findOne({email:email});
       if(!userData){
        return res.status(400).json({
            success:false,
            msg:"email is not exit"
        });
       }
       if(userData.isVerifyed){
        return res.status(200).json({
            success:false,
            msg:"email is alrady vefifyed"
        });
       }
       let msg= `<p1>This is verificatin email , please varify your email by clicking on the url </br>
       <a href="${process.env.BASE_URL}/mail-varification?user_id=${userData._id}">
       ${process.env.BASE_URL}/mail-varification?user_id=${userData._id}
       </a>
       </p>`;

       mailer.sendMail(req.body.email,"Mail Varification",msg);

       return res.status(200).json({
        success:false,
        msg:"send a verification email, plese check"
        });

    }catch(err){
        res.status(400).json({
            success:false,
            msg:"their is some problem!"
        });
    }
}

const resetPassword= async(req,res)=>{
    try{
        let errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                msg:"Errors",
                errors:errors.array()
            });
        }

        let email= req.body.email;
        // check email-> exit
       let userData= await userModel.findOne({email:email});
       if(!userData){
        return res.status(400).json({
            success:false,
            msg:"email is not exit"
        });
       }

       let ranString= randomString.generate();

       await resetPasswordModel.deleteMany({user_id:userData._id});
       
      let token= new resetPasswordModel({
        user_id:userData._id,
        token:ranString
      });
      await token.save();

       let msg= `<p1>This is verificatin email , please varify your email by clicking on the url </br>
       <a href="${process.env.BASE_URL}/reset-password?token=${ranString}">
       ${process.env.BASE_URL}/reset-password?token=${ranString}}
       </a>
       </p>`;

       mailer.sendMail(req.body.email,"Reset Password",msg);

       return res.status(200).json({
        success:true,
        msg:"send a reset password email, plese check"
        });

    }catch(err){
        res.status(400).json({
            success:false,
            msg:"their is some problem!"
        });
    }
}

function generateToken(user){
    return jwt.sign({user},process.env.JWT_SECRET,{expiresIn:"2h"});
}

const userLogin= async(req,res)=>{
    try{
        let {email,password}= req.body;
        let userData= await userModel.findOne({email:email});
        if(!userData){
            return res.status(400).json({
                success:false,
                msg:"Email or Password is not match"
            })
        }
        let isMatch= bcrypt.compare(password,userData.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                msg:"Email or Password is not match"
                
            })
        }
        if(userData.isVerifyed == false){
            return res.status(400).json({
                success:false,
                msg:"Please Verify your Account"
                
            })
        }
       let token= generateToken(userData);

        return res.status(200).json({
            success:true,
            msg:"Loing Succefully!",
            token:token,
            user:userData,
            tokenType:"Bearer"
        });
        
    }catch(err){
        res.status(400).json({
            success:false,
            msg:"their is some problem!"
        });
    }
}

const userProfile= (req,res)=>{
    try{
        res.status(200).json({
            userData:req.user
        })

    }catch(err){
        res.status(400).json({
            success:false,
            msg:"their is some problem!"
        });
    }
}

const userProfileUpdate= async (req,res)=>{
    try{
        const {name}= req.body;
        if(name == undefined){
            return res.status(400).json({
                success:false,
                msg:"username is required"
            })
        }
        let data= {
            "name":name,
        }
        let user_id= req.user.user._id;
        if(req.file != undefined){
            data.image= `images/${req.file.filename}`;

            let userData= await userModel.findOne({_id:user_id});
            let oldPath= path.join(__dirname,"../public/"+userData.image);

            deleteFile(oldPath);
        }
        let updatedData= await userModel.findByIdAndUpdate({_id:user_id},{
            $set:data
        },{new:true});

        return res.status(200).json({
            success:true,
            msg:"succefull update the Data",
            userData:updatedData
        });

    }catch(err){
        res.status(400).json({
            success:false,
            err:err,
            msg:"their is some problem!"
        }); 
    }
}

const logout= async(req,res)=>{
    try{

        const token= req.body.token || req.query.token || req.headers['authorization'];
        const bearer= token.split(" ");
        const bearerToken= bearer[1];

        let blackToken = new blackListTokenModel({
            token:bearerToken,
        })
        await blackToken.save();

        res.setHeader("Clear-Site-Data",'"cookies","storage"');
        return res.status(200).json({
            success:true,
            msg:"Succefully Logout!"
        })
    }catch(err){
        res.status(400).json({
            success:false,
            err:err,
            msg:"their is some problem!"
        }); 
    }
}

const sendOtp= async (req,res)=>{
    try{
        let errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                msg:"Errors",
                errors:errors.array()
            });
        }

        let email= req.body.email;
        // check email-> exit
       let userData= await userModel.findOne({email:email});
       if(!userData){
        return res.status(400).json({
            success:false,
            msg:"email is not exit"
        });
       }
       if(userData.isVerifyed){
        return res.status(200).json({
            success:false,
            msg:"email is alrady vefifyed"
        });
       }
        let g_otp= Math.floor(1000+ Math.random()*9000);
        let otpData= await otpModel.findOne({user_id:userData._id});

        if(otpData){
            let oneStatus= await oneMiniutExpiry(otpData.timestamp);
            if(!oneStatus){
                return res.status(400).json({
                    success:false,
                    msg:"Please Try 1Min Later!"
                })
            }
        }

        let cDate= new Date().getTime();
        await otpModel.findOneAndUpdate(
            {user_id:userData._id},
            {otp:g_otp,timestamp:new Date(cDate)},
            {upsert:true,new:true,setDefaultsOnInsert:true}
        )

       let msg= `<p1>Hi,${userData.name} </br> <h3>${g_otp}</h3> </br>
       </p>`;

       mailer.sendMail(req.body.email,"Mail Varification",msg);

       return res.status(200).json({
        success:false,
        msg:"send a verification email, plese check"
        });

    }catch(err){
        res.status(400).json({
            success:false,
            err:err.message,
            msg:"their is some problem!"
        });
    }
}

const otpVerification= async (req,res)=>{
    try{

        let {user_id,otp}= req.body;
        let otpData= await otpModel.findOne({user_id,otp});
        if(!otpData){
            return res.status(400).json({
                success:false,
                msg:"OTP is Not Match",
            });
        }
        let expirStatus= await otpExpire(otpData.timestamp);
        if(expirStatus){
            return res.status(400).json({
                success:false,
                msg:"OTP expire Plese try again",
            });
        }

        await userModel.findOneAndUpdate({_id:user_id},{
            $set:{
                isVerifyed:true,
            }
        })

        return res.status(200).json({
            success:true,
            msg:"Email succefully Verifed!",
        });

    }catch(err){
        res.status(400).json({
            success:false,
            err:err.message,
            msg:"their is some problem!"
        });
    }
}

const mobileOtpSend= async(req,res)=>{
    try{
        let mobileNumber= req.body.mobile_number;

        let userData= await userModel.findOne({mobile_number:mobileNumber});
        if(!userData){
            res.status(400).json({
                success:false,
                msg:"Your mobile number is not exits",
            });
        }
        if(userData.mobile_number_isVerify){
            res.status(400).json({
                success:false,
                msg:"Mobile Number is Alrady verify!",
            });
        }
        let g_otp= Math.floor((100000+ Math.random()*900000));

        let otpData= await mobileOtpModel.findOne({mobile_number:mobileNumber});
        if(otpData){
            let oneStatus= await oneMiniutExpiry(otpData.timestamp);
            if(!oneStatus){
                return res.status(400).json({
                    success:false,
                    msg:"Please Try 1Min Later!"
                })
            }
        }
        await mobileOtpModel.findOneAndUpdate(
            {mobile_number:mobileNumber},
            {mobile_number:mobileNumber,otp:g_otp},
            {upsert:true,new:true,setDefaultsOnInsert:true}
        )
        
        let twilioClient= new twilio(process.env.ACCOUNT_SID,process.env.ACCOUNT_TOKEN);

        await twilioClient.messages.create({
            body:"This is your OTP from CCHUB "+g_otp,
            to:mobileNumber,
            from:process.env.ACCOUNT_NUMBER,
        });

        return res.status(200).json({
            success:true,
            msg:"OTP succefully send!"
        })

    }catch(err){
        res.status(400).json({
            success:false,
            err:err.message,
            msg:"their is some problem!"
        });
    }
}

const mobileOtpVerify= async(req,res)=>{
    try{
        let {mobile_number,otp,user_id}= req.body;
        let otpData= await mobileOtpModel.findOne({mobile_number,otp});
        if(!otpData){
            return res.status(400).json({
                success:false,
                msg:"OTP is Not Match",
            });
        }
        let expirStatus= await otpExpire(otpData.timestamp);
        if(expirStatus){
            return res.status(400).json({
                success:false,
                msg:"OTP expire Plese try again",
            });
        }

        await userModel.findOneAndUpdate({_id:user_id},{
            $set:{
                mobile_number_isVerifyed:true,
            }
        })

        return res.status(200).json({
            success:true,
            msg:"Mobile Number succefully Verifed!",
        });
        
    }catch(err){
        res.status(400).json({
            success:false,
            err:err.message,
            msg:"their is some problem!"
        });
    }
}
module.exports= {
    userRegistor,
    mailVarification,
    resetPassword,
    userLogin,
    userProfile,
    userProfileUpdate,
    logout,
    sendOtp,
    otpVerification,
    mobileOtpSend,
    mobileOtpVerify
}