const express = require("express");
const cookieParser = require("cookie-parser")

const app = express();
app.use(express.json());
app.use(cookieParser())


/**
 * - Routes Required
 */
const authRouter = require("../src/routes/auth.routes")
const accoutnRouter = require("../src/routes/account.routes")

/**
 * - Use Routes
 */
app.use("/api/v1/auth", authRouter);
app.use("api/v1/account", accoutnRouter)

module.exports = app;