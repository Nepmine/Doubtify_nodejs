// function getUrlParams(url = window.location.href) {
//     let urlStr = url.split("?")[1];
//     return new URLSearchParams(urlStr);

// }
// let appID
// const roomID =
//     getUrlParams().get("roomID") ||
//     "room_" + Math.floor(Math.random() * 1000);
// const userID = Math.floor(Math.random() * 10000) + "";
// const userName = "userName" + userID;
// appID = 1978986993;
// const serverSecret = "dceb1e77c6e5ccb6c4157b71a93958db";
// const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//     appID,
//     serverSecret,
//     roomID,
//     userID,
//     userName
// );

// const zp = ZegoUIKitPrebuilt.create(kitToken);
// zp.joinRoom({
//     container: document.querySelector("#root"),
//     sharedLinks: [
//         {
//             url:
//                 window.location.origin +
//                 window.location.pathname +
//                 "?roomID=" +
//                 roomID,
//         },
//     ],
//     scenario: {
//         mode: ZegoUIKitPrebuilt.OneONoneCallGroupCall,
//     },
// });




// document.addEventListener("DOMContentLoaded", function () {
//     const x = document.querySelector('.Ym5tIpCMz8al_AZ4Lk5y')
//     const url=x.value
//     console.log("The room url is ::", x.value)
// })







//       ----------------------------------------------- From Here ------------------------------------------------


// Get : appID[zego], ServerSecret[zego], userID[userid], username[username + userID], roomID[Database]


const doubtID = '67021e0405682bc1f8d688cd';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiTmVwbWluZSIsImVtYWlsIjoic3VyYWpnaGltaXJlMTM1NzlAZ21haWwuY29tIiwiaWZFeHBlcnQiOmZhbHNlfSwiaWF0IjoxNzI4ODI3ODAzLCJleHAiOjE3Mjk0MzI2MDN9.kWA10gUcQ0sgEEHMdgXiWp84eAXCPWBM0z0UAj5V0UM'

async function initializeMeeting() {
    try {
        const response = await fetch("http://localhost:8080/call/meetingMaterial", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // [Added] Authorization header
            },
            body: JSON.stringify({ doubtID }),
        });

        if (!response.ok) {
            console.error("Response error from server!! [meeting.js]");
            return;
        } else console.log("Data fetched succesfully !")

        const data = await response.json(); 
        const { roomID, appID, serverSecret, username } = data; 
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            Number(appID),
            serverSecret,
            roomID,
            doubtID,
            username + doubtID
          );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container: document.querySelector("#root"),
            sharedLinks: [
                {
                    url:
                        window.location.origin +
                        window.location.pathname +
                        "?roomID=" +
                        roomID,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall, // [Modified] Ensure the mode is correct
            },
        });
    } catch (error) {
        console.error("Error initializing meeting:", error);
    }
}

document.addEventListener("DOMContentLoaded", initializeMeeting);