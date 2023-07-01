require('dotenv').config();

const express = require("express");

const port = process.env.PORT || 8080;

const app = express();

const cookieParser = require("cookie-parser");

const usercontrollers = require("./controllers/usercontroller");
const todocontrollers = require("./controllers/todocontroller")

app.use(cookieParser());
app.use(express.json());

app.get("/",function(req, res) {
    res.json({"data":{"message":"hello internet!"}})
});

app.post("/api/signup",usercontrollers.signupHandler);

app.post("/api/login",usercontrollers.loginHandler)

app.get("/api/logout",usercontrollers.logoutHandler)

app.get("/api/todos",usercontrollers.authorization,todocontrollers.getTodos)

app.post("/api/todo",usercontrollers.authorization,todocontrollers.createTodo)

app.delete("/api/todo/:id",usercontrollers.authorization,todocontrollers.deleteTodo)

app.put("/api/todo/:id",usercontrollers.authorization,todocontrollers.upadateTodo)

app.listen(port, () => console.log("server in running on port %d",port));