const { getAllCar, bookCar, myOrder } = require("../controllers/common.controller")

const { isLoggedIn } = require("../middleware/user.auth")

const express = require("express")

const router = express.Router()

router.post("/getallcar", isLoggedIn, getAllCar)
router.post("/bookcar", isLoggedIn, bookCar)
router.get("/myorder", isLoggedIn, myOrder)

module.exports = router