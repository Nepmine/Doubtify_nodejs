function getUrlParams(url = window.location.href) {
    let urlStr = url.split("?")[1];
    return new URLSearchParams(urlStr);
}

let appID
const roomID =
    getUrlParams().get("roomID") ||
    "room_" + Math.floor(Math.random() * 1000);
    

    const { doubtSchema } = await require('../../models/formModules') // await wrong xa ....
    const person = await doubtSchema.findOne(doubtID || '66a9446d2da69258ee40b2a3')    // Yo chai maile last request pathako aadhar ma k-ta haru le rakhxan
    const roomId = person.roomID


// const userID = Math.floor(Math.random() * 10000) + "";
// const userName = "userName" + userID;
appID = process.env.appID;
const serverSecret = process.env.serverSecret;
const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
    appID,
    serverSecret,
    roomID,
    userID,
    userName
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
        mode: ZegoUIKitPrebuilt.OneONoneCallGroupCall,
    },
});

document.addEventListener("DOMContentLoaded", function () {
    const x = document.querySelector('.Ym5tIpCMz8al_AZ4Lk5y')
    const url=x.value
    console.log("The room url is ::", x.value)


    async function forBackEnd(){
        console.log("Function is called1")
        try {  // here, it is set coz i think it will not effect other document
            console.log("Function is called")
            const response = await fetch('http://localhost:8080/call/initiate', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiYm90MSIsImVtYWlsIjoiYm90QGdtYWlsLmNvbSIsImlmRXhwZXJ0IjpmYWxzZX0sImlhdCI6MTcyNDI2MzkyNiwiZXhwIjoxNzI0ODY4NzI2fQ.MFB_EsO5wG5oGZhb0346I99wCqkb-xs3FeuAA7tTF3o'
                },
                body: JSON.stringify({ 
                    roomUrl: url,
                    expert:true
                 }),
            });
            const data = await response.json();
            console.log("Function is called")
            console.log('Response from server /call/initiate :', data);


        } catch (error) {
            console.error('Error sending room UR in file videoHall.js:', error);
        }

    }
    forBackEnd()

})


