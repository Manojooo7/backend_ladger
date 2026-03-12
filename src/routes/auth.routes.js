const express = require("express");
const authController = require("../controllers/auth.controller")

const authRoutes = express.Router();

/* POST /api/v1/auth/register */
authRoutes.post("/register", authController.userRegisterController)

/* POST /api/v1/auth/login */
authRoutes.post("/login", authController.userLoginController)

/**
 * - POST /api/v1/logout
 */
authRoutes.post("/logout", authController.userLogoutController)

module.exports = authRoutes