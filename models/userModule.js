const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Please enter your full name"]
    },
    username: {
        type: String,
        required: [true, "Please enter your UserName"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your Password"]
    }
}, {
    timestamps: true,
});




const expertSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true]
    },
    description: {
        type: String,
        required: [true]
    },
    jobtitle: { //  array
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
}, {
    timestamps: true,
});
// export garna baki xa
const userschema = mongoose.model("User", userSchema);
const expertschema = mongoose.model("Expert", expertSchema);

module.exports = { userschema, expertschema };
