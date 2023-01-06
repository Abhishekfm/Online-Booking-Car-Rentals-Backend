const JWT = require("jsonwebtoken")
const Customer = require("../models/customer")
const customError = require("../utils/custom.error")
const AuthRoles = require("../utils/auth.roles")

exports.isAdminLoggedIn = async (req, res, next) => {
    let token;
    if(req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))){
        token = req.cookies.token || req.headers.authorization.split(" ")[1]
    }
    // console.log(token);
    if(!token){
        throw new customError("Token is not Present",401)
    }
    try {
        const data = JWT.verify(token, process.env.JWT_SECRET)
        req.user = await Customer.findById(data._id, "_id name email role")
        if(req.user.role === AuthRoles.ADMIN){
            next()
        }else{
            throw new customError("You Are Not Admin to access this Page",401)
        }
    } catch (error) {
        console.log(error);
        throw new customError("Something went wrong",401)
        next()
    }
}