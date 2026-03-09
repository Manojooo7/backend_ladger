const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")
const emailServices = require("../services/email.service")


/**
 * - User register controller
 * - POST /api/v1/auth/register
 */

async function userRegisterController(req,res){
    const {email, name, password} = req.body;

    const isExist = await userModel.findOne({
        email: email
    })

    if(isExist){
        return res.status(422).json({
            message: "User already exist with the email",
            status: "failed"
        })
    }
    
    const user = await userModel.create({
        email: email,
        name: name,
        password: password
    })

    const token = jwt.sign(
        {userId: user._id}, 
        process.env.JWT_SECRET, 
        {expiresIn: "3d"}
    )

    res.cookie("token", token);

    res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        message: "User hase been created successfully",
        status: "successfull"
    })

    emailServices.sendRegistrationEmail(user.email, user.name)
}

/**
 * - User login controller
 * - POST /api/v1/auth/login
 */
async function userLoginController(req,res) {
    const {email, password} = req.body;
    const user = await userModel.findOne({
        email: email
    }).select("+password")

    if(!user){
        res.status(401).json({
            message: "Email or password is not valid",
            status: "failed"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if(!isValidPassword){
        res.status(401).json({
            message: "Email or password is not valid",
            status: "failed"
        })
    }

    const token = jwt.sign(
        {userId: user._id}, 
        process.env.JWT_SECRET, 
        {expiresIn: "3d"}
    )
    
    res.cookie("token", token);

    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        message: "User hase been login successfully",
        status: "successfull",
        token
    })
}

module.exports = {
    userRegisterController,
    userLoginController,
}