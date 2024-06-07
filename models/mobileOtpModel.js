const mongoose= require("mongoose");

const mobileOtpSchema= mongoose.Schema({
    mobile_number:{
        type:Number,
        require:true,
    },
    otp:{
        type:Number,
        require:true,
    },
    timestamp:{
        type:Date,
        default:Date.now,
        get:(timestapm)=> timestapm.getTime(),
        set:(timestapm)=> new Date(timestapm),
    },
    
});

module.exports= mongoose.model("MobileOtp",mobileOtpSchema);
