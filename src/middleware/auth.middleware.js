const tokenBlackListModel = require("../models/blacklist.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authMiddlewate(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    const isBlackListed = await tokenBlackListModel.findOne({
        token
    })

    if(isBlackListed){
        return res.status(401).json({
            message: "Unauthorized access token is black listed"
        })
    }

    try {

        const descodes = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(descodes.userId);

        req.user = user;

        return next();
        
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized access token is invalid"
        })
    }
}

async function authSystemUserMiddleWare(req,res,next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }
    const isBlackListed = await tokenBlackListModel.findOne({
        token
    })

    if(isBlackListed){
        return res.status(401).json({
            message: "Unauthorized access token is black listed"
        })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decode.userId).select("+systemUser");

        if(!user.systemUser){
            res.status(403).json({
                message: "Forbidden access, not a system user"
            })
        }

        req.user = user;
        return next()
    } catch (error) {
         return res.status(401).json({
            message: "Unauthorized access token is invalid"
        })
    }
}

module.exports= {
    authMiddlewate,
    authSystemUserMiddleWare
}