require('dotenv').config()

const express = require("express");
const req = require('express/lib/request');
require("./database/dbquery")

const port = process.env.PORT || 8080

const app = express();

app.use(express.json())

app.get("/",function(req, res) {
    res.json({"data":{"message":"hello internet!"}})
})



app.listen(port, () => console.log("server in running on port %d",port));