const express = require('express')
const dotenv = require('dotenv');
const path = require('path')
dotenv.config({ path: path.resolve(__dirname, '.env') });
const session = require('express-session');
const cors = require('cors');

dotenv.config();
const connectDb = require('./config/dbConnection');
 

const app=express();

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

app.use("/user",require('./router/formRoutes'))
app.use("/call", require('./router/videoCallRoutes'))
app.use("/", require('./router/userRoutes'))


connectDb().catch(error => console.log("Database connection error: ",error));
console.log("[T] Environment variables,",process.env.PORT)
app.listen(process.env.PORT,()=>{console.log("Server is online at port : ", process.env.PORT || 8080)});

