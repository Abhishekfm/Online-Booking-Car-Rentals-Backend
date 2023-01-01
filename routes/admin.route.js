const { createCar, addCarAtSameLocation, decrementCarAtSameLocation, deleteCar } = require("../controllers/admin.controller")
const { isAdminLoggedIn } = require("../middleware/admin.auth")
const express = require("express")

const router = express.Router()

router.post("/createcar", isAdminLoggedIn, createCar)
router.post("/addcaratsamelocation/:carId", isAdminLoggedIn, addCarAtSameLocation)
router.post("/decrementcaratsamelocation/:carId", isAdminLoggedIn, decrementCarAtSameLocation)
router.delete("/deletecar/:carId", isAdminLoggedIn, deleteCar)

module.exports = router