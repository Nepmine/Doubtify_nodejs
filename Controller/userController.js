const {userschema,expertschema} = require('../models/userModule')
const jwt = require('jsonwebtoken')


const asyncHandler = require("express-async-handler") // it is for event handler [to avoid try catch everywhere with database] 

// @desc home page                 --------------------------------home----------------------------
// @route /
// @access public

const home = (req, res) => {
    res.send("Home page")
}




// @desc signup page                 --------------------------------Expert-signup----------------------------
// @route /signup
// @access public

const expsignup = asyncHandler(async (req, res) => {
    console.log(req.body);
    console.log(req.file)


    const { jobtitle, phone, photo, description } = req.body;
    if (!jobtitle || !phone || !description) {
        res.status(400);
        throw new Error("Please fill the every essentials in the form");

    }
    else {  
        const photo = req.file ? req.file.filename : null;
        try{
        const store = await expertschema.create({
            jobtitle,
            phone,
            photo,
            description
        })
        res.status(201).json({ 'message': "Field submitted in database successfully: ", "data": req.body })
    }catch(error){res.status(500).json({ message: error.message });}
    }

})








// @desc expertSignup page                 --------------------------------Signup----------------------------
// @route /signup/expert
// @access private

const signup = asyncHandler(async (req, res) => {
    console.log(req.body);

    const { fullname, email, username, password } = req.body;
    if (!fullname || !email || !username || !password) {
        res.status(400);
        throw new Error("Please fill the every essentials in the form");

    }
    else {
        const store = await userschema.create({ 
            fullname,
            email,
            username,
            password
        })
        res.status(201).json({ 'message': "Field submitted in database successfully: ", "data": req.body })
    }

})





// @desc login page             --------------------------------login----------------------------
// @route /login
// @access public

const login = asyncHandler(async (req, res) => {
    console.log(req.body);


    const { emailOrUsername, password } = req.body;
    console.log("HEllo");
    console.log(emailOrUsername, "and ", password)
    if (!emailOrUsername || !password) {
        res.status(400);
        throw new Error("Please fill the every essentials in the form");
    }
    else {
        const emailPattern = /^\S+@\S+\.\S+$/;

        let person;
        if (emailPattern.test(emailOrUsername)) {// email is used
            person = await userschema.findOne({ email: emailOrUsername })
        }
        else {// username is used
            person = await userschema.findOne({ username: emailOrUsername })
        }
        // uname=await person.uname;
        if (!person)
            res.status(400).json({ message: "Invalid email or password" })
        else {
            if (person.password === password) {// log him
                const accesstoken = jwt.sign({
                    user: {
                        id: person.id,
                        username: person.username,
                        email: person.email,
                    }
                }, process.env.SECRET_KEY, { expiresIn: "1d" })
                res.status(200).json({ "message": "He is logged in but i have to still work on token", "token": accesstoken });

                console.log("[T] User Logged in succesfully")
                console.log("token work remaining")
            }

            else
                res.status(400).json({ message: "Invalid email or password" })
        }
    }

})



module.exports = { home, signup, expsignup, login }