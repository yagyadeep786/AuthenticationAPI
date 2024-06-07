const mongoose= require("mongoose");

const blacklistTokenSchema= mongoose.Schema({
    token:{
        type:String,
        require:true
    },
},{timestamps:true});

module.exports= mongoose.model("blackListToken",blacklistTokenSchema);