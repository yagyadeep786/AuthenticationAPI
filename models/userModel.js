const mongoose= require("mongoose");

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    mobile_number:{
        type:String,
        unique:true,
    },
    mobile_number_isVerify:{
        type:Boolean,
        default:false,
    },
    password:{
        type:String,
        require:true,
    },
    isVerifyed:{
        type:Boolean,
        default:false,
    },
    image:{
        type:String,
    },
},{timestamps:true});

module.exports= mongoose.model("User",userSchema);