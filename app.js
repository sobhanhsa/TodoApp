require('dotenv').config();

const express = require("express");

const port = process.env.PORT || 8080;

const app = express();

const cookieParser = require("cookie-parser");

const usercontrollers = require("./controllers/usercontroller");

app.use(cookieParser());
app.use(express.json());

app.get("/",function(req, res) {
    res.json({"data":{"message":"hello internet!"}})
});

app.post("/api/signup",usercontrollers.signupHandler);

app.post("/api/login",usercontrollers.loginHandler)

app.get("/api/logout",usercontrollers.logoutHandler)

app.get("/api/todos",usercontrollers.authorization,function(req, res) {
    res.json({"data":{"user":req.user}})
})

app.listen(port, () => console.log("server in running on port %d",port));