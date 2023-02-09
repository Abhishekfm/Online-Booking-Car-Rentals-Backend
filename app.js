require("dotenv").config()
const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")
const cors = require("cors")
const userRoute = require("./routes/user.route")
const adminRoute = require("./routes/admin.route")
const commonRoute = require("./routes/common.route")
const connectToDb = require("./config/db")

app.use(express.json())

app.use(express.urlencoded({
    extended:true
}))

const corsOptions ={
    origin:"https://online-booking-car-rentals-frontend.vercel.app", 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
    allowedHeaders:['Content-Type', 'Authorization']
}

app.use(cookieParser())

app.use(cors(corsOptions))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://online-booking-car-rentals-frontend.vercel.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  //Note: The value of the "Access-Control-Allow-Origin" header should be set to the origin that is allowed to access the resource. You can also set it to "*" to allow access from any domain, but this is not recommended for security reasons.
  
  
  
  
  

connectToDb()

app.use("/auth", userRoute)
app.use("/admin", adminRoute)
app.use("/u",commonRoute)

module.exports = app;