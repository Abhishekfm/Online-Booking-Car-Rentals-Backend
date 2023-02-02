const Car = require("../models/car");
const Customer = require("../models/customer");
const Order = require("../models/order")
const emailService = require('../utils/email.service');
const customError = require("../utils/custom.error")
const AuthRoles = require("../utils/auth.roles")
const OrderStatus = require("../utils/order.status")


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
        // const tomorrow = new Date();
        // tomorrow.setDate(tomorrow.getDate() + 1);
        // const currentDate = tomorrow.toISOString().substr(0, 16);
        const userId = user._id
        // const resulted = await Order.find({
        //     $and: [
        //         { "orderDate.endDate": { $lt: currentDate } },
        //         { stage: "PENDING" },
        //         {userId: userId}
        //     ]
        // });
        // const result = await Order.deleteMany({
        //     $and: [
        //         { "orderDate.endDate": { $lt: currentDate } },
        //         { stage: "PENDING" },
        //         {userId: userId}
        //     ]
        // });
        const allOrder = await Order.find({userId})
        if(!allOrder){
            throw new customError("You Have No Orders Yet", 401)
        }
        // console.log(resulted);
        // for (let i = 0; i < resulted.length; i++) {
        //     const element = resulted[i];
        //     const car = await Car.findById(element.carId);
            
        //     if (!car) {
        //       const createCar = await Car.create({
        //         carName: element.carName,
        //         carLocation: element.carLocation,
        //         numberOfCars: 1,
        //         url: "",
        //         totalCars: 1
        //       });
        //     } else {
        //       car.numberOfCars += 1;
        //       await car.save();
        //     }
        //   }          
        res.status(200).json({
            success:true,
            allOrder,
            // resulted
        })
    } catch (error) {
        console.log(error);
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

exports.sendOtp = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(400).send({ message: "Order not found" });
        }
      
        const customer = await Customer.findById(order.userId);
        let { email } = customer;
        if(req.role !== "ADMIN"){
            email = process.env.MY_EMAIL
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresIn = 5 * 60 * 1000;
        const expiresAt = new Date(Date.now() + expiresIn);
      
        order.code = { otp, expiresAt };
        await order.save();
      
        const emailResponse = await emailService.sendOtp(email, otp);
        return res.status(200).json({ 
            message: "OTP sent successfully",
            otp
        });
    } catch (error) {
        console.log(error);
        throw new customError("Some Error Occured")
        // return res.status(400).json({
        //   message: error.message,
        //   error:error
        // })
    }
};
  

exports.verifyOtp = async (req, res) => {
    const { orderId, enteredOtp } = req.body;
  
    try {
        const otp = await Order.findById(orderId)
    
        if (!otp) {
            throw new customError("No order is there")
            // return res.status(400).send({ message: 'Invalid OTP' });
        }
    
        if (otp.code.expiresAt < Date.now()) {
            throw new customError("Out Dated")
            // return res.status(400).send({ message: 'OTP expired' });
        }
        if(Number(otp.code.otp) !== Number(enteredOtp)){
            console.log(otp.code.otp);
            console.log(enteredOtp);
            throw new customError("Entered Otp Is Wrong")
        }
        if(otp.stage === OrderStatus.PENDING){
            otp.stage = "ONGOING";
        }else if (otp.stage === OrderStatus.ONGOING){
            otp.stage = "COMPLETE"
        }
        otp.code ={}
        await otp.save()
        res.status(200).json({ 
            success:true,
            message: 'OTP verified successfully'
        });
    } catch (error) {
        console.log(error);
        throw new customError("Entered Otp Is Wrong")
        res.status(400).send({ message: error.message });
    }
  }