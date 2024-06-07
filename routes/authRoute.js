const express= require("express");
const router= express.Router();
const User= require("../models/userModel");
const resetPasswordModel= require("../models/resetPasswordModel");
const bcrypt = require("bcrypt");
router.get("/mail-varification",async (req,res)=>{
    
    try{
        if(req.query.user_id == undefined){
            return res.render("404");
        }
        let user_id= req.query.user_id;
        let user= await User.findOne({_id:user_id});

        if(user){
            if(user.isVerifyed == false){
              
            await User.findByIdAndUpdate(user_id,{
                $set:{
                    isVerifyed:true,
                }
            });
            return res.render("mailVerify",{message:"mail Varifyed Succefully !"});
            }else{
                return res.render("mailVerify",{message:"email alrady verified succefully!"});
            }
        }else{
            console.log("user not found");
            res.render("mailVerify",{message:"User Not Found , Try Again!"});
        }

    }catch(err){
        res.render("404");
    }
    
})

router.get("/reset-password",async (req,res)=>{
    try{
    let token= req.query.token;

    let tokenData= await resetPasswordModel.findOne({token:token});
    if(!tokenData){
        return res.render("404");
    }
    return res.render("reset-password",{tokenData:tokenData});
    }catch(err){
        return res.render("404");
    }
})

router.post("/reset-password",async (req,res)=>{

    try{
        let {user_id,password,c_password}= req.body;
        let tokenData= resetPasswordModel.findOne({user_id});
        if(password != c_password){
            return res.render("reset-password",{tokenData:tokenData,error:"password and confirm password not match!"});
        }

        let salt= bcrypt.genSaltSync(10);
        let hashPass= bcrypt.hashSync(c_password,salt);
        console.log(hashPass);
        await User.findByIdAndUpdate({_id:user_id},{
            $set:{
                password:hashPass,
            }
        })
        await resetPasswordModel.deleteMany({user_id})
        return res.render("reset-success");

    }catch(err){
        console.log(err);
        return res.render("404");
    }

})

module.exports= router;