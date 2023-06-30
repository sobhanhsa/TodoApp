const {pool} = require("../database/dbquery")

const {isEmailValid} = require("../validators/emailValidator")
const {isUsernameValid} = require("../validators/usernameValidator")

function signupHandler(req, res) {
    
    const body = req.body;

    //check for empty body
    if ((!body.username) || (!body.email) || (!body.name) || (!body.password) 
        || (body.username === "") || (body.email === "") || (body.name === "") || (body.password === "")) {
        res.json({"data":{"message":"please input required fields"}})
        return
    }

    //check email
    if (!isEmailValid(body.email)) {
        res.json({"data":{"message":"invalid email"}})
        return
    }

    //check username
    if (!isUsernameValid(body.username)) {
        res.json({"data":{"message":"invalid username"}})
        return
    }

}

module.exports = {
    signupHandler
}