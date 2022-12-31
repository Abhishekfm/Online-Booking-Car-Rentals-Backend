const mongoose = require("mongoose")

const carSchema = mongoose.Schema(
    {
        carName:{
            type:String
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
            },
            unique:true
        },
        numberOfCars:{
            type:Number,
            default:0
        }
    }
)

module.exports = mongoose.model("Car", carSchema)