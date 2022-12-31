require("dotenv").config()
const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")
const cors = require("cors")
const userRoute = require("./routes/user.route")
const connectToDb = require("./config/db")

app.use(express.json())

app.use(express.urlencoded({
    extended:true
}))

app.use(cookieParser())

app.use(cors())

connectToDb()

app.use("/auth", userRoute)

module.exports = app;