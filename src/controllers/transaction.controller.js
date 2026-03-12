const transactionModel = require("../models/transaction.model");
const ladgerModel = require("../models/ladger.model");
const accountModel = require("../models/account.model");
const  mongoose = require("mongoose");
const ledgerModel = require("../models/ladger.model");
const emailServices = require("../services/email.service");

/**
 * * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
    * 1. Validate request
    * 2. Validate idempotency key
    * 3. Check account status
    * 4. Derive sender balance from ladger
    * 5. Create transaction (PENDING)
    * 6. Create DEBIT ladger entry
    * 7. Create CREDIT ladger entry
    * 8. Mark transaction COMPLETED
    * 9. Commit MongoDB session
    * 10. Send email notification
 */

async function createTransaction(req, res) {
    
    /**
     * 1. Validate data
     */
    const {fromAccount, toAccount, amount, idempotencyKey} = req.body;
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "fromAccount, toAccount, amount and idempotencyKey are required"
        })
    }
    

    try {
        
        const fromUserAccount = await accountModel.findOne({
            _id: fromAccount
        })
        
        const toUserAccount = await accountModel.findOne({
            _id: toAccount
        })
        

        if(!fromUserAccount || !toUserAccount){
            return res.status(400).json({
                message: "Invalid from or to account"
            })
        }

        if(fromAccount === toAccount){
            return res.status(400).json({
                message: "Invalid request received from and to account can't be same"
            })
        }

        /**
         * 2. Validate idempotency key
         */

        const isTransactionAlreadyExists = await transactionModel.findOne({
            idempotencyKey: idempotencyKey
        })

        if(isTransactionAlreadyExists){
            const status = isTransactionAlreadyExists.status;
            switch(status){
                case "COMPLETED":
                    return res.status(200).json({
                        message: "Transaction already processed",
                        transaction: isTransactionAlreadyExists
                    })
                case "FAILED":
                    return res.status(400).json({
                        message: "Transaction failed, please retry"
                    })
                case "REVERSED":
                    return res.status(400).json({
                        message: "Transaction was reversed, please retry"
                    })
                default:
                    return res.status(200).json({
                        message: "Transaction is still proccessing"
                    })
            }
        }

        /**
         * 3. Check account status
         */

        const fromUserAccountStaus = fromUserAccount.status;
        const toUserAccountStatus = toUserAccount.status;

        if(fromUserAccountStaus !== "ACTIVE" || toUserAccountStatus !== "ACTIVE"){
            return res.status(400).json({
                message: "Both parties account status must be ACTIVE to process the transaction"
            })
        }

        /**
         * 4. Derive sender balance from ladger
         */
        const senderBalance = await fromUserAccount.getBalance();
        if(senderBalance < amount){
            return res.status(400).json({
                message: `Insufficient balance, Current balance ${senderBalance} Requested amount ${amount}`
            })
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        
        /**
         * 5. Create transaction (PENDING)
         */
        const transaction = await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], {session});

        const txn = transaction[0];


        /** 
         * 6. Create DEBIT ladger entry
         * 7. Create CREDIT ladger entry
        */
        await ledgerModel.create([
            {
                account: fromAccount,
                amount: amount,
                transaction: txn._id,
                type: "DEBIT"
            },
            {
                account: toAccount,
                amount: amount,
                transaction: txn._id,
                type: "CREDIT"
            }
        ], {session, ordered: true})

        
        /**
         * 8. Mark transaction COMPLETED
         */
        txn.status = "COMPLETED"
        await txn.save({session})
        
        /**
         * 9. Commit MongoDB session
         */
        await session.commitTransaction();
        session.endSession()

        /**
         * 10 Send email notification
         */
        await emailServices.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)
        
        return res.status(201).json({
            message: "Initial fund transaction completed successfully",
            transaction: txn
        })


    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        await emailServices.sendTransactionFaliourEmail(req.user.email, req.user.name, amount, toAccount)
        console.log(error);
        return res.status(500).json({
            message: "Failed to create transactin please try later"
        })   
    }
}

async function createInitialFundsTransction(req,res) {
    const {toAccount, amount, idempotencyKey} = req.body;
    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required"
        })
    }

    const existingTransaction = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if(existingTransaction){
        return res.status(200).json({
            message: "Transaction already processed",
            transaction: existingTransaction
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    })

    if(!fromUserAccount || !toUserAccount){
        return res.status(401).json({
            message: "Invalid from or to account"
        })
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount: toAccount,
        amount: amount,
        idempotencyKey: idempotencyKey,
        status: "PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], {session})

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], {session})

    transaction.status = "COMPLETED"
    await transaction.save({session})
    await session.commitTransaction();
    session.endSession()
    
    return res.status(201).json({
        message: "Initial fund transaction completed successfully",
        transaction: transaction
    })
}   

module.exports= {
    createTransaction,
    createInitialFundsTransction
}