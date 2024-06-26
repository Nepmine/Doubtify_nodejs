const express = require('express')
const router = express.Router();
const path = require('path')
const multer = require('multer')
const validateToken = require('../middleware/tokenValidation')

const {userschema,expertschema }= require('../models/userModule')



const { home, signup,expsignup, login } = require('../Controller/userController');

// Routes -------------------------------------

router.route("/").get(validateToken, home);

router.route("/signup").post(signup)
// router.route("/signup").put(signup) 
// [] maile signup ko database role milai rathe

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);    //needs to change [unique way of varifying]
    }
});
const upload = multer({ storage: storage });

router.route("/signup/expert").post(validateToken,upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'proof', maxCount: 3 }, { name: 'library', maxCount: 3 }]), expsignup);



router.route("/login").post(login)


module.exports = router;