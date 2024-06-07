
const oneMiniutExpiry= async(otpTime)=>{
    let cTime= new Date().getTime();
    let oneMiniut= Math.abs((otpTime- cTime))/(1000);
    oneMiniut /= 60;
    if(oneMiniut > 1){
        return true;
    }

    return false;
}

const otpExpire= async(otpTime)=>{
    let cTime= new Date().getTime();
    let oneMiniut= Math.abs((otpTime- cTime))/(1000);
    oneMiniut /= 60;
    if(oneMiniut > 3){
        return true;
    }

    return false;
}

module.exports= {
    oneMiniutExpiry,
    otpExpire,

}