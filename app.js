const express = require("express")
const app = express()

const cookieParser = require("cookie-parser")
const cors = require("cors")

app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use(cookieParser())
app.use(cors())

module.exports = app;