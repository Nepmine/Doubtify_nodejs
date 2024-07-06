const mongoose = require('mongoose');

const userSchema = mongoose.Schema({   // define role
    fullname: {
        type: String,
        required: [true, "Please enter your full name"]
    },
    username: {
        type: String,
        required: [true, "Please enter your UserName"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your Password"]
    },
    role: {
        type: [String],
    },
    notifications: [{
        message: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        read: {
            type: Boolean,
            default: false
        }
    }],
    meetings:[{
        doubtId:{
            type: String,
        }, rating:{
            type: Number,
            min:0,
            max:10
        }}]
}, {
    timestamps: true,
});




const expertSchema = mongoose.Schema({
    username: {
        type: String,
    },
    title: {
        type: String,
        required: [true]
    },
    description: {
        type: String,
        required: [true]
    },
    jobtitle: { 
        type: String,
    },
    expertese: { //  array
        type: [String],
        required: [true]
    },
    resume: {
        type: String
    },
    proof: { //  array
        type: [String],
        required: [true]
    },
    library: { //  array
        type: [String],
    },
    links: {
        type: [String],
    },
    notifications: [{
        message: String,
        timestamp: {
            type: Date,
            default: Date.now
        },
        read: {
            type: Boolean,
            default: false
        }
    }],
    meetings:[{
        doubtId:{
            type: String,
        },status:{
            type: String,
        }, rating:{
            type: Number,
            min:0,
            max:10
        },comment:{
            type: String
        }}]
}, {
    timestamps: true,
});
// export ma kaam garna baki xa
// give valid name to photoes n maybe password hashing using  [pre] 


const userschema = mongoose.model("User", userSchema);
const expertschema = mongoose.model("Expert", expertSchema);

module.exports = { userschema, expertschema };