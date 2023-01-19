const Car = require("../models/car")
const Order = require("../models/order")
const Customer = require("../models/customer")
const customError = require("../utils/custom.error")


exports.createCar = async (req, res) => {
    try {
        const { user } = req
        const { carName, carLocation, numberOfCars, url } = req.body
        if(!carName || !carLocation || !numberOfCars || numberOfCars < 0){
            throw new customError("Provide all Details")
        }

        const carExist = await Car.findOne({'carName':`${carName}`, 'carLocation.country':`${carLocation.country}`,'carLocation.state':`${carLocation.state}`,'carLocation.city':`${carLocation.city}`})
        console.log(carExist+"lplpl");
        if(carExist){
            carExist.numberOfCars = Number(carExist.numberOfCars) + Number(numberOfCars)
            carExist.totalCars = Number(carExist.totalCars) + Number(numberOfCars)
            console.log(url);
            if(url){
                carExist.url = url;
                console.log(carExist.url);
            }
            await carExist.save()
            res.status(200).json({
                success:true,
                carExist
            })
            return
        }
        let car;
        let totalCars = numberOfCars
        if(url){
            car = await Car.create({
                carName,
                carLocation,
                numberOfCars,
                url,
                totalCars
            })
        }else{
            car = await Car.create({
                carName,
                carLocation,
                numberOfCars,
                totalCars
            })
        }
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
        carExist.totalCars += 1;
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
        carExist.totalCars -= 1;
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

exports.showCarDb = async (req, res) => {
    try {
        let { skipNo } = req.body
        console.log(skipNo);
        if(!skipNo){
            skipNo = 0
        }
        skipNo = skipNo * 5
        const users = await Car.find({});
        const allCar = await Car.find().sort({$natural:-1}).skip(skipNo).limit(5)
        res.status(200).json({
            success:true,
            length:allCar.length,
            totalLength:users.length,
            allCar
        })
    } catch (error) {
        throw new customError("Something Went Wrong", 401)
    }
}

exports.showOrderDb = async (req, res) => {
    try {
        const orders = await Order.find().all()
        res.send(orders)
    } catch (error) {
        throw new customError("Something Went Wrong", 401)
    }
}

exports.getOrdersOfCar = async (req, res) => {
    try {
        const { carId } = req.params
        const orders = await Order.find({carId:carId})
        console.log(carId);
        if(!orders){
            throw new customError("No orders", 401)
        }
        res.status(200).json({
            success:true,
            orders
        })
    } catch (error) {
        console.log(error);
        throw new customError("Something went wrong", 401)
    }
}

exports.getName = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id);
        if(!id){
            throw new customError("Id is not in params", 401)
        }
        const user = await Customer.findById(id)
        if(!user){
            throw new customError("User Not Exist", 401)
        }
        res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        console.log(error);
        throw new customError("Something went Wrong", 401)
    }
}

exports.getTotalCars = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id);
        if(!id){
            throw new customError("Id is not in params", 401)
        }
        const car = await Car.findById(id)
        if(!car){
            throw new customError("Car Not Exist", 401)
        }
        res.status(200).json({
            success:true,
            car
        })
    } catch (error) {
        console.log(error);
        throw new customError("Something went Wrong", 401)
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        let { skipNo } = req.body
        console.log(skipNo);
        if(!skipNo){
            skipNo = 0
        }
        skipNo = skipNo * 5
        const users = await Customer.find({});
        const allUser = await Customer.find().sort({$natural:-1}).skip(skipNo).limit(5)
        res.status(200).json({
            success:true,
            length:allUser.length,
            totalLength:users.length,
            allUser
        })
    } catch (error) {
        throw new customError("Something Went Wrong", 401)
    }
}

exports.getOrdersById = async (req, res) => {
    try {
        const { userId } = req.params
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