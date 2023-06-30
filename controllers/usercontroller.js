const {pool} = require("../database/dbquery")

const {isEmailValid} = require("../validators/emailValidator")
const {isUsernameValid} = require("../validators/usernameValidator")

async function signupHandler(req, res) {
    
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

    

    pool.query("INSERT INTO users (Username, Email, Name, Password) VALUES($1, $2, $3, $4) RETURNING *",
    [body.username,body.email,body.name,body.password], (error, result ) => {
        console.log(result)
        if (error) {
            res.status(400).json({"data":{"message":"error occurred","error":error}})
            return
        }
        res.status(201).json({"data":{"message":"createduser","user":result.rows[0]}})
    })
 
    

}

module.exports = {
    signupHandler
}