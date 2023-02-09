const Customer = require("../models/customer");
const customError = require("../utils/custom.error")
const cookieOptions = require("../utils/cookie.options")
const AuthRoles = require("../utils/auth.roles")
const checkIfAdmin = require("../utils/check.admin")

exports.createUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            throw new customError("Enter All your Details", 401);
        }
        const userExist = await Customer.findOne({email})

        if(userExist){
            throw new customError("Email Already Exist", 401);
        }
        let details;
        if(checkIfAdmin(email)){
            let role = AuthRoles.ADMIN
            details = {
                name,
                email,
                role,
                password
            }
        }else{
            details = {
                name,
                email,
                password
            }
        }
        const user = await Customer.create(details);
        const token  = await user.getJwtToken();
        console.log(user);
        user.password = undefined;
        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success:true,
            token,
            user
        })
    } catch (error) {
        console.log(error);
        throw new customError("Something Went Wrong", 401);
    }
}

exports.login = async (req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password){
            throw new customError("Provide all details", 401)
        }
        const userExist = await Customer.findOne({email})
        if(!userExist){
            throw new customError("User does not Exist", 401);
        }
        const matched = await userExist.comparePassword(password)
        if(!matched){
            throw new customError("Credentials are Wrong pswd", 401);
        }
        const token = await userExist.getJwtToken()
        userExist.password = undefined;
        res.cookie("token", token, cookieOptions);
        console.log(req.cookies.token )
        // console.log({
        //     success:true,
        //     token,
        //     userExist
        // });
        res.status(201).json({
            success:true,
            token,
            userExist
        })
    } catch (error) {
        console.log(error);
        throw new customError("Something Went Wrong", 401);
    }
}

exports.logout = async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            sameSite :'None',
            secure : true
        })
        sessionStorage.clear()
        sessionStorage.removeItem("token");
        res.clearCookie("token",{
            expires: new Date(Date.now()),
            httpOnly: true,
            sameSite :'None',
            secure : true
        })
        res.status(200).json({
            success: true,
            message: "Logged Out"
        })
    } catch (error) {
        throw new customError("Something Went Wrong", 401);
    }
}

exports.getDashboard = (req, res) => {
    try {
        const { user } = req;
        if(!user || !user.name || !user.email || !user._id){
            res.status(201).json({
                success:true,
                role:"NOROLE",
                user:user
            })
            // throw new customError("Not authorized to access this route", 401)
            return
        }
        res.status(201).json({
            success: true,
            name: user.name,
            email: user.email,
            role: user.role,
            ID:  user._id
        })
    } catch (error) {
        throw new customError("Something Went Wrong", 401);
    }
}