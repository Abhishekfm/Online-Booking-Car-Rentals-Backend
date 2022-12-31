const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")
const cors = require("cors")
const userRoute = require("./routes/user.route")

app.use(express.json())

app.use(express.urlencoded({
    extended:true
}))

app.use(cookieParser())

app.use(cors())

app.use("/auth", userRoute)

module.exports = app;