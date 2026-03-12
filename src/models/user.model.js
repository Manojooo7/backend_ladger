const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        require: [true, "Email is required to create a user"],
        trim: true,
        lowercase: true,
        match: [/^.+@(?:[\w-]+\.)+\w+$/, 'Please fill a valid email address'],
        unique: [true, "Email already registerd"],
    },
    name:{
        type: String,
        require: [true, "Name is reuqired to create an user"]
    },
    password: {
        type: String,
        require: [true, "Password is required to create an account"],
        minLength: [6, "Password shoulb be contain more then 6 characters"],
        select: false
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: false,
        select: false
    }
},{
    timestamps: true,
})

userSchema.pre("save", async function() {
    if(!this.isModified("password")){
        return;
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    return;
})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel