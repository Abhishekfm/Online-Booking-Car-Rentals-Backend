const { getAllCar, bookCar, myOrder, bookCarWithEndDate, deleteOrder } = require("../controllers/common.controller")

const { isLoggedIn } = require("../middleware/user.auth")

const express = require("express")

const router = express.Router()

router.post("/getallcar", isLoggedIn, getAllCar)
router.post("/bookcar", isLoggedIn, bookCar)
router.get("/myorder", isLoggedIn, myOrder)
router.post("/bookcarwithenddate", isLoggedIn, bookCarWithEndDate)
router.delete("/deleteorder/:carId/:orderId", isLoggedIn, deleteOrder)

module.exports = router