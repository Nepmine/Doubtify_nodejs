
const { userschema, expertschema } = require('../models/userModule')
const { meetingFinalSchema } = require('../models/formModules')
const session = require('express-session');
const jwt = require('jsonwebtoken')
const asyncHandler = require("express-async-handler")
const {wss, sendMessageToUser} = require('../ws/websocketServer');


// desc: made for demo purpose to check if someone joined the room
//Path: /call/initiate
const videoBasics = asyncHandler(async (req, res) => {
    const { expert /* Boolean */, doubtID } = req.body;

    // Room Id is to be determined by database, and the meeting ID is also necessary
    const decodedInfo = user.decoded;
    const username = decodedInfo.user.username

    if (expert) {  // if it was expert who joined, the message should be send to user
        await userschema.updateOne(
            { username: username },
            {
                $push: {
                    notifications: {
                        message: `user ${username} joined, url"${'http://127.0.0.1:5500/Doubtify/views/Static/videoHall.html/'}" and doubtID : ${doubtID}`
                    }
                }
            }
        );

    } else {
        await expertschema.updateOne(
            { username: username },
            {
                $push: {
                    notifications: {
                        message: `expert ${username} joined, url"${'http://127.0.0.1:5500/Doubtify/views/Static/videoHall.html/'}" and doubtID : ${doubtID}`
                    }
                }
            }
        );
    }

    res.status(200).json({ message: " Notification send successfully" })

})
// maile yes paxi websocket stablish garna sakxu



//@disc: check if there is meeting or not [returns there is meeting or not]
// //Path: /call/checkMeeting
const checkMeeting = asyncHandler(async (req, res) => {

    const decodedInfo = req.user.decoded;
    const username = decodedInfo.user.username;

    const user = await userschema.findOne({ username: username })
    const expert = await expertschema.findOne({ username: username })
    const userMeetings = user ? user.meetings : [];
    const expertMeetings = expert ? expert.meetings : [];

    if (!(userMeetings.length || expertMeetings.length)) {
        res.status(200).send(0)
        console.log("There is no meeting scheduled of this person")
    }
    else {
        // const { meetingFinalSchema } = require('../models/formModules')
        const time = []
        const timeExpert = ["expert"]
        if (expertMeetings.length) {
            //expertMeeting holds all the meetings in the expert schema
            for (const meeting of expertMeetings) {
                const meetingId = meeting.meetingId
                const meetfinal = await meetingFinalSchema.findOne({ _id: meetingId })
                // meetfinal is holding the data of the videocall [The smaller one]
                timeExpert.push(meetfinal.finalTime)
                console.log(timeExpert)
                console.log("------------------------------------------------------------------------")
                // this is pushing this into the timexpert array, (no change is related to the database)
            }
            time.push(timeExpert)
        }
        const timeLearner = ["learner"]
        if (userMeetings.length) {
            for (const meeting of userMeetings) {
                const meetingId = meeting.meetingId
                const meetfinal = await meetingFinalSchema.findOne({ _id: meetingId })
                timeLearner.push(meetfinal.finalTime)
            }
            time.push(timeLearner)
        }
        res.status(200).json({ message: "The time for the meeting of the perticular user is provided with there role", time: time })
    }
})
// for the join button [joined and other waiting others]



//@disc: It just passes the information if the other has joined or not
// method:: post
// //Path: /call/join
const joinButton = asyncHandler(async (req, res) => {

    let { expertCheck/*Boolean*/ } = req.body;
    expertCheck = expertCheck === '1'; // if the person clicked the button is user or expert
    console.log(expertCheck)
    if(!req.session) console.log("Session Error !!!")
    const username = req.session.username;
    console.log(username)
    const expert = await expertschema.findOne({ username })
    const learner = await userschema.findOne({ username })

    if (!expertCheck) { // if it is learner, notification should be given to expert that he joined
        if (expert) {
            expert.notifications.push({ message: `[Meeting] : Expert joined the session` });
            console.log("Message sent successfully to :",expert.username)
            await expert.save();

            // for webSocket
                const message = `User ${learner.username} has joined the meeting and is waiting for start ...`
                sendMessageToUser(learner.username, message);
        } else {
            return res.status(404).send('Expert not found');
            console.log("Expert not found")
        }
    }
    else {
        if (learner) {
            learner.notifications.push({ message: `[Meeting] : Learner joined the session` });
            console.log("Message sent successfully to :",learner.username)
            await learner.save();

            // for webSocket
                const message = `Expert ${expert.username} has joined the meeting and is waiting for start ...`
                sendMessageToUser(expert.username, message);

        } else {
            console.log("Learner not found")
            return res.status(404).send('Learner not found');
        }
        res.status(200).send('Joined successfully');
    }

})




// Title: 10 minutes interval
// method:: get
/* @disc: One in previous, we had checked if there was a meeting, from that frontend developers will find out if 
there is a meeting. If any meeting was 10 minutes gap, this function is called  */
//Path: ws://localhost:8080/call/tenMin
const hasMeeting = asyncHandler(async (req, res) => {
    console.log("Hello there")
    // usually it doesnot do anything
})  

module.exports = { videoBasics, checkMeeting, joinButton,hasMeeting }



// things left to do