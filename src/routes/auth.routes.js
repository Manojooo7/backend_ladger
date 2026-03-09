const express = require("express");
const authController = require("../controllers/auth.controller")

const router = express.Router();

/* POST /api/v1/auth/register */
router.post("/register", authController.userRegisterController)

/* POST /api/v1/auth/login */
router.post("/login", authController.userLoginController)

module.exports = router