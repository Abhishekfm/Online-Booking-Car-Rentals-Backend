const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
    {
        name:{
            type:String,
            require:[true, "Name is required"],
            maxLength:[50,"Name must be less than 50"]
        },
        email:{
            type:String,
            require:[true,"Email is required"],
            unique:true
        },
        password:{
            type:String,
            require:[true,"Password is required"],
            minLength:[8, "Password must be greator than 8 character"]
        }
    }
)

module.exports = mongoose.model("User", userSchema)