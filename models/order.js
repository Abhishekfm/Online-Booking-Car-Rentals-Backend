const mongoose = require("mongoose")

const orderSchema = mongoose.Schema(
    {
        carName:{
            type:String,
            require:true
        },
        carId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Car",
            require:true
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            require:true
        },
        orderDate:{
            startDate:{
                type:Date,
                require:true
            },
            endDate:{
                type:Date,
                require:true
            }
        },
        numberOfCars:{
            type:Number
        }
    }
)

module.exports = mongoose.model("Order", orderSchema);