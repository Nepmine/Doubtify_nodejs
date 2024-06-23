const express = require('express')
const dotenv = require('dotenv');

dotenv.config();
const connectDb = require('./config/dbConnection');


const app=express();



// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/", require('./router/userRoutes'))


connectDb().catch(error => console.log("Database connection error: ",error));

app.listen(process.env.PORT,()=>{console.log("Server is online at port : ", process.env.PORT)});


