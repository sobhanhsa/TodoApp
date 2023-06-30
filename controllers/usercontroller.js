const {pool} = require("../database/dbquery")

function signupHandler(req, res) {
    
    const body = req.body;

    if ((!body.username) || (!body.email) || (!body.name) || (!body.password) 
        || (body.username === "") || (body.email === "") || (body.name === "") || (body.password === "")) {
        res.json({"data":{"message":"please input required fields"}})
        return
    }

    
}

module.exports = {
    signupHandler
}