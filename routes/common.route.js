const { getAllCar, bookCar } = require("../controllers/common.controller")

const { isLoggedIn } = require("../middleware/user.auth")

const express = require("express")

const router = express.Router()

router.post("/getallcar", isLoggedIn, getAllCar)
router.post("/bookcar", isLoggedIn, bookCar)

module.exports = router