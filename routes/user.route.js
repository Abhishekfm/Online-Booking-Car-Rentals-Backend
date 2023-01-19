const { createUser, login, logout, getDashboard } = require("../controllers/user.controller")
const { isLoggedIn } = require("../middleware/user.auth")
const express = require("express")

const router = express.Router()


router.post("/createuser",createUser)
router.post("/login",login)
router.get("/logout",logout)
router.get("/dashboard", isLoggedIn, getDashboard)

module.exports = router