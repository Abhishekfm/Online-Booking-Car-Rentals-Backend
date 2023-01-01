const Car = require("../models/car")
const customError = require("../utils/custom.error")


exports.createCar = async (req, res) => {
    try {
        const { user } = req
        const { carName, carLocation, numberOfCars } = req.body
        if(!carName || !carLocation || !numberOfCars || numberOfCars < 0){
            throw new customError("Provide all Details")
        }

        const carExist = await Car.findOne({'carName':`${carName}`, 'carLocation.country':`${carLocation.country}`,'carLocation.state':`${carLocation.state}`,'carLocation.city':`${carLocation.city}`})
        console.log(carExist+"lplpl");
        if(carExist){
            carExist.numberOfCars += numberOfCars
            await carExist.save()
            res.status(200).json({
                success:true,
                carExist
            })
            return
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
        console.log(error);
        throw new customError("something went wrong", 402)
    }

}

exports.addCarAtSameLocation = async (req, res) => {
    try {
        const { carId } = req.params
        if(!carId){
            throw new customError("Provide Detail", 401)
        }
        const carExist = await Car.findById(carId);
        if(!carExist){
            throw new customError("Wrong Details", 401)
        }
        carExist.numberOfCars += 1;
        await carExist.save()
        res.status(200).json({
            success:true,
            carExist
        })
    } catch (error) {
        console.log(error);
        throw new customError("Somethig went wrong", 401)
    }
}

exports.decrementCarAtSameLocation = async (req, res) => {
    try {
        const { carId } = req.params
        if(!carId){
            throw new customError("Provide Detail", 401)
        }
        const carExist = await Car.findById(carId);
        if(!carExist){
            throw new customError("Wrong Details", 401)
        }
        if(carExist.numberOfCars < 1){
            throw new customError("Cannot decrement", 401)
        }
        carExist.numberOfCars -= 1;
        await carExist.save()
        res.status(200).json({
            success:true,
            carExist
        })
    } catch (error) {
        console.log(error);
        throw new customError("Somethig went wrong", 401)
    }
}


exports.deleteCar = async (req, res) => {
    try {
        const { carId } = req.params
        if(!carId){
            throw new customError("Provide Detail", 401)
        }
        const carExist = await Car.findByIdAndRemove(carId);
        if(!carExist){
            throw new customError("Wrong Details", 401)
        }
        res.status(200).json({
            success:true,
            carExist
        })
    } catch (error) {
        console.log(error);
        throw new customError("Somethig went wrong", 401)
    }
}