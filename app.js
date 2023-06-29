require('dotenv').config()

const express = require("express");

const port = process.env.PORT || 8080

const app = express();

app.get("/",function(req, res) {
    res.json({"data":{"message":"hello internet!"}})
})

app.listen(port, () => console.log("server in running on port %d",port));