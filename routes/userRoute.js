const express= require("express");
const route= express.Router();
const upload= require("../middleware/uploadFile");
const {userRegistor,mailVarification,resetPassword,userLogin,userProfile,userProfileUpdate,logout,sendOtp,otpVerification,mobileOtpSend,mobileOtpVerify}= require("../controller/userCtrl");
const {registerValidator,mailVarificationValidator,resetPasswordValidator}= require("../helper/validator");
const auth= require("../middleware/auth");
route.post("/register",upload.single("image"),userRegistor);

route.post("/mail-verification",mailVarificationValidator,mailVarification);

route.post("/forget-password",resetPasswordValidator,resetPassword);

route.post("/login",userLogin);

route.get("/profile",auth,userProfile);

route.post("/update-profile",auth,upload.single("image"),userProfileUpdate);

route.get("/logout",auth,logout);

route.get("/send-otp",mailVarificationValidator,sendOtp);

route.post("/otp-verify",otpVerification);

route.post("/mobile-otp-send",mobileOtpSend);

route.post("/mobile-otp-verify",mobileOtpVerify);


module.exports= route;