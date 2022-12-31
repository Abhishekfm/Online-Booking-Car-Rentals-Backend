const {createUser, login, logout} = require("../controllers/user.controller")
const express = require("express")

const router = express.Router()


router.post("/createuser",createUser)
router.post("/login",login)
router.post("/logout",logout)

module.exports = router