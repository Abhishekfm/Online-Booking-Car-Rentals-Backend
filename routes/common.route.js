const { getAllCar, bookCar, myOrder, bookCarWithEndDate, deleteOrder, sendOtp, verifyOtp } = require("../controllers/common.controller")

const { isLoggedIn } = require("../middleware/user.auth")

const express = require("express")

const router = express.Router()

router.post("/getallcar", getAllCar)
router.post("/bookcar", isLoggedIn, bookCar)
router.get("/myorder/:skipNo2", isLoggedIn, myOrder)
router.post("/bookcarwithenddate", isLoggedIn, bookCarWithEndDate)
router.delete("/deleteorder/:carId/:orderId", isLoggedIn, deleteOrder)
router.get("/sendotp/:orderId/:sbjct/:msg", isLoggedIn, sendOtp)
router.post("/verifyotp", isLoggedIn, verifyOtp)

module.exports = router