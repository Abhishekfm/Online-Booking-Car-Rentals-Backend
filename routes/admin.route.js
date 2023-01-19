const { createCar,
    addCarAtSameLocation, 
    decrementCarAtSameLocation, 
    deleteCar, 
    showCarDb, 
    showOrderDb, 
    getOrdersOfCar, 
    getName, 
    getTotalCars, 
    getAllUsers, 
    getOrdersById } = require("../controllers/admin.controller")
const { isAdminLoggedIn } = require("../middleware/admin.auth")
const express = require("express")

const router = express.Router()

router.post("/createcar", isAdminLoggedIn, createCar)
router.get("/addcaratsamelocation/:carId", isAdminLoggedIn, addCarAtSameLocation)
router.get("/decrementcaratsamelocation/:carId", isAdminLoggedIn, decrementCarAtSameLocation)
router.delete("/deletecar/:carId", isAdminLoggedIn, deleteCar)
router.post("/showcardb", isAdminLoggedIn, showCarDb)
router.get("/showorderdb", isAdminLoggedIn, showOrderDb)
router.get("/getordersofcar/:carId", isAdminLoggedIn, getOrdersOfCar)
router.get("/getname/:id", isAdminLoggedIn, getName)
router.get("/gettotalcars/:id", isAdminLoggedIn, getTotalCars)
router.post("/getalluser", isAdminLoggedIn, getAllUsers)
router.get("/getorderbyid/:userId", isAdminLoggedIn, getOrdersById)

module.exports = router