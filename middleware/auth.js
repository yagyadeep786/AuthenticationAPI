const jwt= require("jsonwebtoken");
const blackListTokenModel= require("../models/blacklistTokenModel");

const jwtAuth= async(req,res,next)=>{
    const token= req.body.token || req.query.token || req.headers['authorization'];

    if(!token){
        return res.status(403).json({
            success:false,
            msg:"Token is requried for authentication"
        })
    }

    try{
        let splitToken= token.split(" ")[1];
        
        let blacklistToken= await blackListTokenModel.findOne({token:splitToken});

        if(blacklistToken){
            return res.status(400).json({
                success:false,
                msg:"Session has Expird!,Login Again"
            })
        }

       let tokenDecodedData= jwt.verify(splitToken,process.env.JWT_SECRET);
        req.user= tokenDecodedData;
    }catch(err){
        return res.status(401).json({
            success:false,
            err:err.message,
            msg:"Invalid Token"
        })
    }

    return next();
}

module.exports= jwtAuth;