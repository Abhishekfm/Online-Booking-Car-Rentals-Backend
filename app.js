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
    origin:"http://localhost:3000", 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
    allowedHeaders:['Content-Type', 'Authorization']
}

app.use(cookieParser())

app.use(cors(corsOptions))

connectToDb()

app.use("/auth", userRoute)
app.use("/admin", adminRoute)
app.use("/u",commonRoute)

module.exports = app;