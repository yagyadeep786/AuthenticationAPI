const fs= require("fs").promises;
const path= require("path");

const deleteFile= async(filePath)=>{
    try{
        await fs.unlink(filePath);
        console.log("image deleted succefully!");
    }catch(err){
        console.log("file is not deleted!",err);
    }
}

module.exports= deleteFile;