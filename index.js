const express= require("express");
const app= express();
require("dotenv").config();
const userRoute= require("./routes/userRoute");
const bodyParser= require("body-parser");
const mongoose= require("mongoose");
const authRoute= require("./routes/authRoute");
const cors= require("cors");
const docsRoute= require("./docs");

app.use(cors({
    origin:['http://localhost:5173']
}
));
mongoose.connect("mongodb://localhost:27017/auth")
.then(()=>{
    console.log("db connect succefully");
}).catch((err)=>{
    console.log(err);
})



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({extended:false}));
app.set("view engine","ejs");
app.set("views","./views");
app.use("/api",userRoute);
app.use("/",authRoute);
app.use("/api-docs",docsRoute);

let port= process.env.PORT || 3000;
app.listen(port,()=> console.log("port is listing port "+port));

