const { createCar } = require("../controllers/admin.controller")
const { isAdminLoggedIn } = require("../middleware/admin.auth")
const express = require("express")

const router = express.Router()

router.post("/createcar", isAdminLoggedIn, createCar)


module.exports = router