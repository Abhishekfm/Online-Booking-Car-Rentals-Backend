const JWT = require("jsonwebtoken")
const Customer = require("../models/customer")
const customError = require("../utils/custom.error")

exports.isLoggedIn = async (req, res, next) => {
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
        next()
    } catch (error) {
        console.log(error);
        throw new customError("Something went wrong",401)
        next()
    }
}
exports.isDashboardLoggedIn = async (req, res, next) => {
    let token;
    if(req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))){
        token = req.cookies.token || req.headers.authorization.split(" ")[1]
    }
    // console.log(token);
    if(!token){
        next()
        // throw new customError("Token is not Present",401)
    }
    try {
        const data = JWT.verify(token, process.env.JWT_SECRET)
        req.user = await Customer.findById(data._id, "_id name email role")
        next()
    } catch (error) {
        console.log(error);
        // throw new customError("Something went wrong",401)
        next()
    }
}