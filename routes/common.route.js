const { getAllCar, bookCars } = require("../controllers/common.controller")

const { isLoggedIn } = require("../middleware/user.auth")

const express = require("express")

const router = express.Router()

router.post("/getallcar", isLoggedIn, getAllCar)
router.post("/bookcars", isLoggedIn, bookCars)

module.exports = router