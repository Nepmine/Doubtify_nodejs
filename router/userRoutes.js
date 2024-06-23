const express = require('express')
const router = express.Router();
const path = require('path')
const multer = require('multer')
// const validateToken = require('../middleware/tokenValidation')

const {userschema,expertschema }= require('../models/userModule')



const { home, signup,expsignup, login } = require('../Controller/userController');

// Routes -------------------------------------

router.route("/").get(home)

router.route("/signup").post(signup)
router.route("/signup").put(signup)


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

router.route("/signup/expert").post(upload.single('avatar'), expsignup);



router.route("/login").post(login)






module.exports = router;