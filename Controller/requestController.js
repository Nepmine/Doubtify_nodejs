// note: If you are seeing this in github, requestcontroller is just being initiated, its just template, not data


const { doubtSchema } = require('../models/formModules')
const { expertschema, userschema } = require('../models/userModule')
const asyncHandler = require("express-async-handler")
const session = require('express-session');



const notifications = asyncHandler(async (req, res) => {
    try {
        const username = req.session.username;  // if there is username undefined, its coz you didnot proceed with login and stuff correctly
        console.log(username);
        const user = await expertschema.findOne({ username })
        if (user) {
            const unreadNotifications = user.notifications.filter(notification => !notification.read);
            if (unreadNotifications.length > 0) {
                console.log(unreadNotifications)
                res.status(202).send(unreadNotifications)
            }
            else {
                res.send("Sorry, no notifications")
            }
        } else
            res.send("username is invalid")

    } catch (e) {
        console.log("[E] Error while fatching unread notifications", e)
        res.status(500).send("An error occurred while fetching notifications");
    }
})