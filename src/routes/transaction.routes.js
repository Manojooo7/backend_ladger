const express = require("express");
const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middleware/auth.middleware")

const transactionRoutes = express.Router();

/**
 * - POST /api/v1/transactions
 * - Create new transaction
 */
transactionRoutes.post("/", authMiddleware.authMiddlewate, transactionController.createTransaction)

/**
 * - POST /api/transaction/system/initial-funds
 * - Create initial fund transaction from system user
 */
transactionRoutes.post("/system/initial-funds", authMiddleware.authSystemUserMiddleWare, transactionController.createInitialFundsTransction)

module.exports = transactionRoutes;