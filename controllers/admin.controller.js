const Car = require("../models/car")
const customError = require("../utils/custom.error")


exports.createCar = async (req, res) => {
    try {
        const { user } = req
        const { carName, carLocation, numberOfCars } = req.body

        if(!carName || !carLocation || !numberOfCars || numberOfCars > 0){
            throw new customError("Provide all Details")
        }

        const carExist = await Car.find({carName,carLocation})

        if(carExist){
            carExist.numberOfCars += numberOfCars
            await carExist.save()
            res.status(200).json({
                success:true,
                carExist
            })
        }
        const car = await Car.create({
            carName,
            carLocation,
            numberOfCars
        })
        res.status(200).json({
            success:true,
            car:car
        })
    } catch (error) {
        
    }

}