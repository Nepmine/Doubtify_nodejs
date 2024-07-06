const { userschema, expertschema } = require('../models/userModule')
const { doubtSchema } = require('../models/formModules')
const jwt = require('jsonwebtoken')


const asyncHandler = require("express-async-handler") // it is for event handler [to avoid try catch everywhere with database] 

// @desc home page                 --------------------------------home----------------------------
// @route /
// @access public

const home = asyncHandler(async (req, res) => {
    const user = req.user;
    const decodedInfo = user.decoded;
    const username = decodedInfo.user.username


    const expertAccount = await expertschema.findOne({ username: username });

    // Filter notifications to find unread ones
    if (expertAccount) {
        const notifications = expertAccount.notifications
        const unreadNotifications = notifications.filter(notification => !notification.read);
        console.log(unreadNotifications);

        // Calculate the count of unread notifications
        const notificationCount = unreadNotifications.length;
        console.log(notificationCount);
        res.send(`Hello ${user.token}, How are you? Welcome to our home page. Notification count =${notificationCount} and notifications: ${unreadNotifications} `);
    }
    else {
        console.log("0 Notifications");
        res.send(`Hello ${user.token}, How are you? Welcome to our home page. Notification count =0 and notifications:Null `);
    }

})




// @desc signup page                 --------------------------------Expert-signup----------------------------
// @route /signup
// @access public

const expsignup = asyncHandler(async (req, res) => {

    // console.log("[E] Error Check :")
    const { title, description, jobtitle, expertese, links } = req.body;
    const resume = req.file ? req.file.filename : null;
    const proof = req.files['proof'].map(file => file.filename);
    let library;
    try {

        library = req.files['library'].map(file => file.filename);
    }
    catch (err) { library = '' }


    if (!title || !description || !expertese || !proof) {
        res.status(400);
        throw new Error("Please fill the every essentials in the form");
    }
    else {
        const decodedInfo = req.user.decoded;
        username = decodedInfo.user.username;
        try {
            const store = await expertschema.create({
                username,
                title,
                description,
                jobtitle,
                expertese: Array.isArray(expertese) ? expertese : [expertese],
                resume,
                proof,
                library,
                links: Array.isArray(links) ? links : [links]
            })
            if (store) {
                console.log("[T] Expert data submitted ::")
                // console.log("Decoded info::", decodedInfo)
                person = await userschema.findOne({ username: username })
                if (!person.role.includes('expert')) {
                    person.role.push('expert')
                    await person.save();
                }

                // for displaying first notifications to the expert :::
                const newNotifications = await doubtSchema.find({
                    field: { $in: expertese }
                });
                let Notification=[]
                for(let i of newNotifications){
                    Notification.push(`From ${i.username} with doubt id: ${i._id} has a doubt for you :: ${i.doubt} with duration ${i.time.duration}`)
                } // 
                console.log("Work for him ::", Notification)

                person = await userschema.findOne({ username: username })
                console.log(person.role)
                res.status(201).json({
                    'message': "Field submitted in database successfully: ",
                    "data": req.body,
                    "Notification": Notification
                })
            }
            else console.log("[E] Role couldnot be modified to expert")

        } catch (error) { res.status(500).json({ message: error.message }); }

    }
})





// @desc expertSignup page                 --------------------------------Signup----------------------------
// @route /signup/expert
// @access private

const signup = asyncHandler(async (req, res) => {
    console.log("req.body is :", req.body);

    const { fullname, email, username, password } = req.body;
    if (!fullname || !email || !username || !password) {
        res.status(400);
        console.log("The fields are :", fullname, email, username, password)
        throw new Error("Please fill the every essentials in the form");
    }
    else {
        const store = await userschema.create({
            fullname,
            email,
            username,
            password,
            role: "user"
        })
        res.status(201).json({ 'message': "Field submitted in database successfully: ", "data": req.body })
    }

})




// @desc login page             --------------------------------login----------------------------
// @route /login
// @access public

const login = asyncHandler(async (req, res) => {
    console.log("logged in ::")
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
        let accesstoken;
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
            if (person.password === password) {// log him   // need to change the role to expert also during expert login
                accesstoken = jwt.sign({
                    user: {
                        id: person._id,
                        username: person.username,
                        email: person.email
                    }
                }, process.env.SECRET_KEY, { expiresIn: "1d" })
                console.log("Generated Token:", accesstoken);
                res.status(200).json({ "message": "He is logged in", "token": accesstoken });
                console.log("[T] User Logged in succesfully")
            }
            else
                res.status(400).json({ message: "Invalid email or password" })
        }
    }

})



module.exports = { home, signup, expsignup, login }