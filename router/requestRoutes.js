const express = require('express')
const formrouter = express.Router();
const path = require('path')
const multer = require('multer')
const validateToken = require('../middleware/tokenValidation')

const { userdoubt, notifications,notification, finalTimenPrice,selectExpert} = require('../Controller/formController');





const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/formuploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);   //needs to change [unique way of varifying]
    }
});
const uploadfiles = multer({ storage: storage });

formrouter.route("/doubt").post(validateToken,uploadfiles.fields([{ name: 'doubtPictures', maxCount: 5 }]),userdoubt);

formrouter.route("/notification/selectExpert").post(validateToken, selectExpert); // just added    

module.exports = formrouter;