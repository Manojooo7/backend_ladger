const express = require("express");
const authMiddlewate = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controller")

const accountRoutes = express.Router();

/**
 * - POST api/v1/account
 * - Create an new account
 * - Protected route
 */
accountRoutes.post("/", authMiddlewate.authMiddlewate, accountController.createAccountCotroller);

/**
 * - GET api/v1/accounts/
 * - Get all accounts associated to logged in user
 * - Protected Route
*/
accountRoutes.get("/", authMiddlewate.authMiddlewate, accountController.getAllAccounts);

/**
 * - GET api/v1/accounts/balance/:accountid
 */

accountRoutes.get("/balance/:accountId", authMiddlewate.authMiddlewate, accountController.getAccountBalance);

module.exports = accountRoutes

