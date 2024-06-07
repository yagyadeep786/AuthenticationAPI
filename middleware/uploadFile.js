const multer= require("multer");
const path= require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if(file.mimetype == "image/jpeg" || file.mimetype == "image/png"){
        
        cb(null, path.join(__dirname,'../public/images'))
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix +file.fieldname+file.originalname)
    }
  })
  
  // const fileFilter= (req,file,cb)=>{
  //     if(file.mimetype == "image/jpeg" || file.mimetype == "image/png"){
  //       cb(null,true);
  //     }else{
  //       cb(null,false);
  //     }
  // }
  const upload = multer({ storage: storage})

module.exports= upload;