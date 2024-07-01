const mongoose = require('mongoose');

const doubt = mongoose.Schema({   // define role
    doubt: {
        type: String,
        required: [true, "Please enter your doubt"]
    },
    doubtDiscription: {
        type: String,
        required: [true, "Please express your doubt in some form"]
    },
    field: {
        type: [String],
        required: [true, "Please enter the field of expert you are seeking for"]
    },
    doubtPictures: {
        type: [String]
    },
}, {
    timestamps: true,
});

const doubtSchema = mongoose.model("Doubt", doubt);  

module.exports = { doubtSchema};