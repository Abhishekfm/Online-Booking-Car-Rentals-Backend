const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const JWT = require("jsonwebtoken")
const AuthRoles = require("../utils/auth.roles")

const customerSchema = mongoose.Schema(
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
        role: {
            type: String,
            enum: Object.values(AuthRoles),
            default: AuthRoles.USER
        },
        password:{
            type:String,
            require:[true,"Password is required"],
            minLength:[8, "Password must be greator than 8 character"]
        }
    }
)

customerSchema.pre("save", async function(next){
    if(!this.isModified){
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next()
})

customerSchema.methods = {
    getJwtToken:function (){
        return JWT.sign(
            {
                _id:this._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        )
    },
    comparePassword: async function(enteredPassword){
        return await bcrypt.compare(enteredPassword, this.password)
    }
}

module.exports = mongoose.model("Customer", customerSchema)