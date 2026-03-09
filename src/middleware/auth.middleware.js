const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authMiddlewate(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        res.staus(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    try {
        
    } catch (error) {
        
    }
}