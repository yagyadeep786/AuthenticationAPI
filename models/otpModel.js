const mongoose= require("mongoose");

const otpSchema= mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
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

module.exports= mongoose.model("Otp",otpSchema);