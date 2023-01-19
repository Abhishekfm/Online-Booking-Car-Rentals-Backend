const Car = require("../models/car")
const Order = require("../models/order")
const customError = require("../utils/custom.error")


exports.getAllCar = async (req, res) => {
    try {
        const { country, state, city, startDate, endDate } = req.body;

        if(!country || !state || !city || !startDate || !endDate){
            throw new customError("Provide All Details",401)
        }

        const allCar = await Car.find({'carLocation.country':`${country}`,'carLocation.state':`${state}`,'carLocation.city':`${city}`,'numberOfCars':{$gt:0}})
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
        const { carId, startDate, endDate}= req.body
        if(!carId || !startDate || !endDate){
            throw new customError("Provide all details", 401)
        }
        const carExist = await Car.findById(carId);
        if(!carExist || carExist.numberOfCars < 1){
            // const carOrder = await Order.find({ carId: carId,
            //     $or: [
            //         { 
            //             "orderDate.startDate": { $lt: startDate }, 
            //             "orderDate.endDate": { $lt: startDate } 
            //         },
            //         { 
            //             "orderDate.startDate": { $gt: endDate }, 
            //             "orderDate.endDate": { $gt: endDate } 
            //         }]
            // })
            // if(!carOrder||carOrder.length < 1){
            //     throw new customError("OUT OF STOCK", 401)
            // }
            // const createOrder = await Order.create({
            //     carName: carOrder[0].carName,
            //     carId: carOrder[0].carId,
            //     userId: carOrder[0].userId,
            //     orderDate:{
            //         startDate:startDate,
            //         endDate:endDate
            //     },
            //     numberOfCars:1
            // })
            // res.status(200).json({
            //     success:true,
            //     createOrder,
            //     carOrder
            // })
            return
        }
        carExist.numberOfCars -= 1;
        if(!req.user){
            throw new customError("You are not Logged In", 401)
        }
        await carExist.save()
        const createOrder = await Order.create({
            carName: carExist.carName,
            carId: carExist._id,
            userId: req.user._id,
            orderDate:{
                startDate:startDate,
                endDate:endDate
            },
            numberOfCars:1,
            carLocation:carExist.carLocation
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

exports.bookCarWithEndDate = async(req, res) => {
    try {
        const { carId, startDate, endDate}= req.body
        if(!carId || !startDate || !endDate){
            throw new customError("Provide all details", 401)
        }
        const carExist = await Car.findById(carId);
        if(!carExist || carExist.numberOfCars > 1){
            res.status(400).json({
                success:false,
                carExist
            })
            throw new customError("We still have stock", 401)
        }
        const carOrder = await Order.find({ carId: carId, "orderDate.startDate": { $gt: endDate } })
        res.status(200).json({
            success:true,
            carOrder
        })
        // carExist.numberOfCars -= 1;
        // await carExist.save()
        // const createOrder = await Order.create({
        //     carName: carExist.carName,
        //     carId: carExist._id,
        //     userId: userId,
        //     orderDate:{
        //         startDate:startDate,
        //         endDate:endDate
        //     },
        //     numberOfCars:1
        // })
        // res.status(200).json({
        //     success:true,
        //     createOrder
        // })
    } catch (error) {
        console.log(error);
        throw new customError("Something Went Wrong",401)
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const { carId, orderId } = req.params
        if(!carId || !orderId){
            throw new customError("Provide All Information", 401)
        }
        const thisOrder = await Order.findByIdAndRemove(orderId)
        if(!thisOrder){
            console.log(thisOrder);
            throw new customError("This Order Not Exist", 401)
        }
        const car = await Car.findById(carId)
        if(!car){
            const carExist = await Car.findOne({'carName':`${thisOrder.carName}`, 'carLocation.country':`${thisOrder.carLocation.country}`,'carLocation.state':`${thisOrder.carLocation.state}`,'carLocation.city':`${thisOrder.carLocation.city}`})
            if(carExist){
                carExist.numberOfCars += 1
                carExist.save()
                res.status(200).json({
                    success:true,
                    carExist
                })
                return
            }
            const createCar = await Car.create({
                carName: thisOrder.carName,
                carLocation:thisOrder.carLocation,
                numberOfCars:1,
                url:"",
                totalCars:1
            })
            res.status(200).json({
                success:true,
                createCar
            })
            return
        }
        car.numberOfCars += 1
        await car.save()
        res.status(200).json({
            success:true,
            car
        })
    } catch (error) {
        console.log(error);
        throw new customError("Something went wrong", 401)
    }
}