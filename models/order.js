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
        },
        carLocation:{
            country:{
                type:String,
                require:[true, "Location is required"]
            },
            state:{
                type:String,
                require:[true, "Location is required"]
            },
            city:{
                type:String,
                require:[true, "Location is required"]
            }
        },
        stage:{
            type:String,
            default:"PENDING"
        },
        code:{
            otp:{
                type:String,
                default:""
            },
            expiresAt:{
                type:Date
            }
        },
        price:{
            type:Number,
            require:true,
            default:1050
        },
        address:{
            type:String,
            default: function () {
                return `${this.carLocation.country}, ${this.carLocation.state}, ${this.carLocation.city}`;
            }
        }
    }
)

module.exports = mongoose.model("Order", orderSchema);