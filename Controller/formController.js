const { doubtSchema } = require('../models/formModules')
const { expertschema, userschema } = require('../models/userModule')
const asyncHandler = require("express-async-handler")



// @desc doubt submition for expert       --------------------------------Doubt submition----------------------------
// @route /user/signup
// @access private
const userdoubt = asyncHandler(async (req, res) => {

    // console.log("[C] Error Check :")
    const { doubt, doubtDiscription, field, minMoney, maxMoney, currency, date, ranges, duration} = req.body;
    let doubtPictures;
    try {

        doubtPictures = req.files['doubtPictures'].map(file => file.filename);
    }
    catch (err) { doubtPictures = '' }


    if (!doubt || !doubtDiscription || !field) {
        res.status(400);
        throw new Error("[E] Please fill the every essentials in the form");
    }
    else {
        try {
            const decodedInfo = req.user.decoded;
            username = decodedInfo.user.username;

            const store = await doubtSchema.create({
                username,
                doubt,
                doubtDiscription,
                field: Array.isArray(field) ? field : [field],
                doubtPictures,
                money: {
                    min: minMoney,
                    max: maxMoney,
                    currency
                },
                currency,
                time: {
                    date,
                    ranges,
                    duration
                },
                status:"Doubt submitted"
            })
            {
                const usernameCopy = username

                const skilledExperts = await expertschema.find({ expertese: { $in: field } });
                skilledExpertsUsername = skilledExperts.map(user => user.username)
                console.log("[T] Experts are ::", skilledExpertsUsername)

                const doubtSource = await doubtSchema.findOne({ username: username });
                const doubtId = doubtSource._id;
                console.log("[T] The data is ", doubtId);


                for (const _expert of skilledExpertsUsername) {
                    await expertschema.updateOne(
                        { username: _expert },
                        {
                            $push: {
                                notifications: {
                                    message: `From ${usernameCopy} with doubt id: ${doubtId} has a doubt for you :: ${doubt} with duration ${duration}`
                                }
                            }
                        }
                    );
                }
                console.log("[T] Notification send successfully ..")
                // if this works, I have to find a way to send doubt to frontend by checking the unreaded doubts in his schema
                // also send notification every time a new notification appears in his notificationSection in schema
            }


            console.log("[T] Doubt data submitted successfully !!")
            res.status(201).json({ 'message': "Field submitted in database successfully: ", "data": req.body })
        } catch (error) { res.status(500).json({ message: `[E] There was error in formController Doubt submission :${error.message}` }); }
    }
});



// @desc notifications request. It loads with home page  --------------------------------Get notifications home page----------------------------
// @route get : user/notifications
// @access private
const notifications = asyncHandler(async (req, res) => {
    try {
        const decodedInfo = req.user.decoded;
        username = decodedInfo.user.username;
        const unreadNotifications = await expertschema.find(
            { username: username },
            { notifications: { $elemMatch: { read: false } } }
        )
        if(unreadNotifications){
        unreadNotificationsCount=unreadNotifications.lean()
        res.status(202).send(unreadNotifications)
        console.log(unreadNotifications)
        }

    } catch (e) { console.log("[E] Error while fatching unread notifications") }
})



// @desc Expert asks the doubt discription --------------------------------Doubt description request----------------------------
// @route get : user/notification
// @access private
const notification = asyncHandler(async (req, res) => {
    try {
        // Access headers correctly
        const userUsername = req.headers.username; // it is the username of user with doubt
        const userDoubtId = req.headers.doubtid; // same here

        if (!userUsername || !userDoubtId) {
            console.log("Username and DoubtId should be submitted for getting doubt");
            return res.status(400).json({ error: "Username and DoubtId should be submitted for getting doubt" });
        }

        const doubt = await doubtSchema.findOne({ username: userUsername, _id: userDoubtId });
        if (!doubt) {
            return res.status(404).json({ error: "Doubt not found" });
        }

        // Send the found doubt document
        res.status(200).json(doubt);
        console.log(doubt);
    } catch (e) {
        console.error("[E] Error while fetching doubt notification at formcontroller", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// its Front-End
// const response = await fetch(`/notification?username=${username}&doubtId=${doubtId}`, {
//     method: 'GET'
// });



// @desc Notification by expert to finalize price --------------------------------final time Expert Dicision----------------------------
// @route post : user/notification/finalTimenPrice
// @access public
const finalTimenPrice = asyncHandler(async (req, res) => {  // public route 
    try {
        const { finalTime, finalPrice, username, expertname, finalDuration, doubtId } = req.body; // username -> The one had a doubt
        // changed my mind and doing via body, we can inserting using post in js easily ...
        if (!finalTime || !finalPrice || !username || !expertname) {
            return res.status(400).json({ error: 'Final time, final price, username, and expert name must be provided' });
        }

        const userWithDoubt = await userschema.findOne({ username: username });
        console.log(userWithDoubt)
        
        userWithDoubt.notifications.push({message: `Expert ${expertname} has agreed to take meeting doubtId:${doubtId} at ${finalTime} for ${finalDuration} with RS${finalPrice}.`})
        await userWithDoubt.save()

        const doubt=doubtSchema.findOne({_id:doubtId})
        if(doubt.status=="Doubt submitted")
        doubt.status="Expert Options provided"
        doubt.save();

        res.status(200).send("Request send to the user..")

    } catch (e) { console.log("[E] Error in finalNotification",e) }
})



// @desc User selects the expert from the contained list -------------------------------- Expert selection by User----------------------------
// @route post : expert/notification/selected
// @access private
const selectExpert = asyncHandler(async (req, res) => {  // public route
    try {
        const {expertname, finalPrice, finalTime, finalDuration, doubtId} = req.body;
        // changed my mind and doing via body, we can inserting using post in js easily ...
        if (!expertname) {
            return res.status(400).json({ error: 'expertname not found ' });
            console.log("expertname not found code in: in Expert selection by user")
        }
        const expertPurposing = await expertschema.findOne({ username: expertname });
        const decodedInfo = req.user.decoded;
        username = decodedInfo.user.username;
        

        expertPurposing.notifications.push({message: `Your meeting is conformed at ${finalTime} with Rs${finalPrice} with ${username} for ${finalDuration} hour, Dont be late !!`})
        expertPurposing.meetings={doubtId,status:"Selected"}
        await expertPurposing.save()

        const doubt=doubtSchema.findOne({_id:doubtId})
        if(doubt.status=="Doubt submitted" || "Expert Options provided" )
        doubt.status="Expert Selected expertID = ${expertname}"
        doubt.save();

        res.status(200).json({message: `For DoubtID: ${doubtId}, The meeting is conformed at ${finalTime} with Rs${finalPrice} for ${finalDuration} hour long with ${expertname} for final`})
    } catch (e) { console.log("[E] Error in finalNotification",e) }
})

module.exports = { userdoubt, notifications, notification, finalTimenPrice, selectExpert };