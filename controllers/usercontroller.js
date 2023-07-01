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
    };

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
                });
    
                res.status(201).json({"data":{"message":"createduser","user":result.rows[0]}});
            });
        });
    }catch(e) {
        res.status(500)
            .json({"data":{"message":"some thing went wrong please inform server staff","error":e}})
    };
};

async function loginHandler(req, res) {

    if (req.cookies.access_token) {
        res.status(406).json({"data":{"message":"you are already logged in"}})
        return
    };

    const body = req.body;

    //check for empty body
    if (((!body.username) && (!body.email)) || (!body.password) 
        || ((body.username === "") && (body.email === "")) || (body.name === "") || (body.password === "")) {
        res.status(400).json({"data":{"message":"please input required fields"}})
        return
    };

    let query = "";

    if (body.username !== "") {
        query = `SELECT * FROM users WHERE Username = '${body.username}'`
    }else {
        query = `SELECT * FROM users WHERE Email = '${body.email}'`
    };

    pool.query(query , (error, result ) => {
        
        if (error) {
            res.status(500).json({"data":{"message":"somethin went wrong , please try lator"}});
            return
        };

        if (result.rowCount === 0) {
            res.status(400).json({"data":{"message":"no users found with given username/email.","error":error}});
            return
        };

        bcrypt.compare(body.password, result.rows[0].password, function(err, matched) {  
            // console.log(matched)
            if (matched) {

                const token = jwt.sign({ id: result.rows[0].id}, process.env.SECRET);
    
                let expireDate = new Date(Date.now() + 15*24*60*60*1000);
    

                //set cookie
                res.cookie("access_token", token, {
                    expires: expireDate,
                    secure: false,
                    httpOnly: true,
                    sameSite: 'lax',
                });

                res.status(200).json({"data":{"message":"wellcome back "+result.rows[0].name,
                "user":result.rows[0]}});
            
                return
           } else {
                res.status(400).json({"data":{"message":"incorrect password"}});
                return
           };
        });
    });
};

function logoutHandler(req, res) {

    if (!req.cookies.access_token) {
        res.status(403).json({"data":{"message":"you're not logged in"}})
        return
    };

    return res
        .clearCookie("access_token")
        .status(200)
        .json({"data":{ message: "you're successfully logged out"}});
}

//authorizaion middleware
function authorization(req, res, next) {

    const token = req.cookies.access_token;
    
    if (!token) {
        res
            .status(403)
            .json({"data":{"message":"you're not logged in , to see or publish todo please login"}});
        return
    }

    try {
        const data = jwt.verify(token, process.env.SECRET);
        
        pool.query("SELECT * FROM users WHERE ID = $1",[parseInt(data.id)],(err, result) => {

            if (result.rowCount === 0) {
                return res.status(403).json({"data":{"message":"your account has been deleted."}});
            }

            req.user = result.rows[0];

            return next();
        });
    } catch {
        return res.status(403).json({"data":{"message":"invalid token"}});
    };
}

module.exports = {
    signupHandler,
    loginHandler,
    logoutHandler,
    authorization
};