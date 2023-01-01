const Car = require("../models/car")
const Order = require("../models/order")
const customError = require("../utils/custom.error")


exports.getAllCar = async (req, res) => {
    try {
        const { country, state, city, startDate, endDate } = req.body;

        if(!country || !state || !city || !startDate || !endDate){
            throw customError("Provide All Details",401)
        }

        const allCar = await Car.find({'carLocation.country':`${country}`,'carLocation.state':`${state}`,'carLocation.city':`${city}`})
        if(!allCar){
            res.status(200).json({
                success:false,
                message:"No Car Available in your location"
            })
            return
        }
        res.status(200).json({
            success:true,
            allCar
        })
    } catch (error) {
        console.log(error);
        throw new customError("Something went wrong")
    }

}


exports.bookCar = async (req, res) => {
    try {
        const { carId, userId, startDate, endDate}= req.body
        if(!carId || !startDate || !endDate){
            throw new customError("Provide all details", 401)
        }
        const carExist = await Car.findById(carId);
        if(!carExist || carExist.numberOfCars < 1){
            throw new customError("OUT OF STOCK", 401)
        }
        carExist.numberOfCars -= 1;
        await carExist.save()
        const createOrder = await Order.create({
            carName: carExist.carName,
            carId: carExist._id,
            userId: userId,
            orderDate:{
                startDate:startDate,
                endDate:endDate
            },
            numberOfCars:1
        })
        res.status(200).json({
            success:true,
            createOrder
        })

    } catch (error) {
        console.log(error);
        throw new customError("Something Went Wrong",401)
    }
}


exports.myOrder = async (req, res) => {
    try {
        const { user } = req
        const userId = user._id
        const allOrder = await Order.find({userId})
        if(!allOrder){
            throw new customError("You Have No Orders Yet", 401)
        }
        res.status(200).json({
            success:true,
            allOrder
        })
    } catch (error) {
        throw new customError("Something went wrong", 401)
    }
}