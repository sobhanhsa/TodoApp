require('dotenv').config();

const express = require("express");

const port = process.env.PORT || 8080;

const app = express();

const cookieParser = require("cookie-parser");

const controllers = require("./controllers/usercontroller");

app.use(cookieParser());
app.use(express.json());

app.get("/",function(req, res) {
    res.json({"data":{"message":"hello internet!"}})
});

app.post("/api/signup",controllers.signupHandler);

app.listen(port, () => console.log("server in running on port %d",port));