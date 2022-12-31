const Car = require("../models/car")
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


exports.bookCars = async (req, res) => {
    try {
        const { data } = req.body //Data is a array of object

        if(!data){
            throw new customError("No car for order", 401)
        }

        const changeData = []
        const availableCars = true

        await data.forEach(async element => {
            const car = await Car.findOne({_id:element._id})
            if(!car){
                throw new customError("This car is not available", 401)
            }
            if(car.numberOfCars >= element.numberOfCars){
                car.numberOfCars -= element.numberOfCars
                changeData.push(car)
                await car.save()
                // console.log(car);
            }
        });
        res.status(200).json({
            success:true,
            cars:data
        })
        return
    } catch (error) {
        throw new customError("Something Went Wrong",401)
    }
}