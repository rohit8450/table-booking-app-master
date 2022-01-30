
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const isEmpty = require("is-empty");

module.exports = function(req){
    const errors ={}
    let user = {}

    const bearerHeader = req.headers['authorization'];
    
    if(bearerHeader){
        
        const bearer = bearerHeader.split(' ');

        const bearerToken = bearer[1];

        jwt.verify(bearerToken,keys.secretOrKey,(err,data)=> {
            if(err){
                errors.token = "Invalid Token"
            }
            else {
               
                user =data
            }
            
        });        
    }
    else {
        console.log("executed")
        errors.token = "Token Invalid"
    }


    return {
        errors,
        isValid : isEmpty(errors),
        user : user
        
    }

}