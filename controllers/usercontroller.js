const {pool} = require("../database/dbquery");

const {isEmailValid} = require("../validators/emailValidator");
const {isUsernameValid} = require("../validators/usernameValidator");

const jwt = require("jsonwebtoken");

const bcrypt  = require("bcrypt");
const saltRounds = 10;

async function signupHandler(req, res) {
    
    if (req.cookies.access_token) {
        res.status(406).json({"data":{"message":"you are already logged in"}})
        return
    }

    const body = req.body;

    //check for empty body
    if ((!body.username) || (!body.email) || (!body.name) || (!body.password) 
        || (body.username === "") || (body.email === "") || (body.name === "") || (body.password === "")) {
        res.status(400).json({"data":{"message":"please input required fields"}})
        return
    }

    //check email
    if (!isEmailValid(body.email)) {
        res.status(400).json({"data":{"message":"invalid email"}})
        return
    }

    //check username
    if (!isUsernameValid(body.username)) {
        res.status(400).json({"data":{"message":"invalid username"}})
        return
    }

    let hashedPassword = ""

    try {
        bcrypt.hash(body.password , saltRounds, (err, hash) => {
 
            pool.query("INSERT INTO users (Username, Email, Name, Password) VALUES($1, $2, $3, $4) RETURNING *",
            [body.username,body.email,body.name,hash], (error, result ) => {
                // console.log(result)
                if (error) {
                    res.status(400).json({"data":{"message":"error occurred","error":error}})
                    return
                }
                
                const token = jwt.sign({ id: result.rows[0].ID}, process.env.SECRET);
    
                let expireDate = new Date(Date.now() + 15*24*60*60*1000);
    
                res.cookie("access_token", token, {
                    expires: expireDate,
                    secure: false,
                    httpOnly: true,
                    sameSite: 'lax',
                })
    
                res.status(201).json({"data":{"message":"createduser","user":result.rows[0]}});
            });
        });
    }catch(e) {
        res.status(500)
            .json({"data":{"message":"some thing went wrong please inform server staff","error":e}})
    }
};

module.exports = {
    signupHandler
};