const express = require('express')
const dotenv = require('dotenv');
const path = require('path')
dotenv.config({ path: path.resolve(__dirname, '.env') });
const session = require('express-session');
const cors = require('cors');
const { wss } = require('./ws/websocketServer')
const http = require('http');

dotenv.config();
const connectDb = require('./config/dbConnection');

const app = express();
const server = http.createServer(app);

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use("/request", require('./router/requestRoutes'))
app.use("/user", require('./router/formRoutes'))
app.use("/call", require('./router/videoCallRoutes'))
app.use("/", require('./router/userRoutes'))


connectDb().catch(error => console.log("Database connection error: ", error))


server.on('upgrade', (request, socket, head) => {
    console.log('Upgrade request received');
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});


console.log("[T] Environment variables,", process.env.PORT)
server.listen(process.env.PORT, () => { console.log("Server is online at port : ", process.env.PORT || 8080) })
