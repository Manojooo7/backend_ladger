const express = require("express");
const cookieParser = require("cookie-parser")

const app = express();
app.use(express.json());
app.use(cookieParser())


/**
 * - Routes Required
 */
const authRoutes = require("../src/routes/auth.routes")
const accoutnRoutes = require("../src/routes/account.routes")
const transactionRoutes = require("../src/routes/transaction.routes")

/**
 * - Use Routes
 */
app.get("/", (req,res)=>{
    return res.status(200).json({
        message: "Server is up and running"
    })
})
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/accounts", accoutnRoutes);
app.use("/api/v1/transactions", transactionRoutes);

module.exports = app;