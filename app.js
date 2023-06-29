const express = require("express");

const app = express();

app.get("/",function(req, res) {
    res.json({"data":{"message":"hello internet!"}})
})

app.listen(8080);