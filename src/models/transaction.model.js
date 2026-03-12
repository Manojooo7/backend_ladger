const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must be associated with debtor account"],
        index: true,
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must be associated with creditor account"],
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "Status can be either PENDING, COMPLETED, FAILED or REVERSED"
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: [true, "Amount is required for creating a transaction"],
        min: [1, "Transaction amount cannot be negetive"]
    },
    idempotencyKey: {
        type: String,
        required: [true, "Idempotancy key is required for creating a transaction"],
        index: true,
        unique: true
    }
}, {
    timestamps: true
});

transactionsSchema.index({fromAccount: 1, createdAt: -1});
transactionsSchema.index({toAccount: 1, createdAt: -1});


const transactionModel = mongoose.model("transaction", transactionsSchema);
module.exports = transactionModel;