// validate the token

const asyncHandler= require('express-async-handler')
const jwt= require('jsonwebtoken')

const validateToken = asyncHandler(async(req, res, next) =>{
    let token;
    let autHeader = req.headers.authorization || req.headers.Authorization;
    if(autHeader && autHeader.startsWith("bearer"))
        {
            token = autHeader.split(" ")[1];
            jwt.verify(token,process.env.SECRET_KEY,(err,decoded) =>{
                if(err){
                    res.status(401);
                    throw new error("You are not authorized");
                }
                else{console.log(decoded)} // pass the decoded information
            })
        }
        
})

module.exports(validateToken)