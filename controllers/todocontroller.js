const {pool} = require("../database/dbquery");

function getTodos(req, res) {

    pool.query("SELECT * FROM todo WHERE UserId = $1",[parseInt(req.user.id)],(error , result) => {
        if (error) {
            res.status(500).json({"data":{"message":"please try later"}});
            return
        }
        res.status(200).json({"data":{"user":req.user,"todos":result.rows,"todos length":result.rowCount}});
        return
    });

};

function createTodos(req, res) {
    if ((!req.body.description) || (req.body.description === "")) {
        res.status(400).json({"data":{"message":"please input required fields"}})
        return
    }

    pool.query("INSERT INTO todo (Description, UserId) VALUES($1, $2) RETURNING *",
        [req.body.description,req.user.id],(error, result) => {
        if(error) {
            res.status(500).json({"data":{"message":"please try later"}});
            return
        };
        res.status(201).json({"data":{"user":req.user,"todos":result.rows[0],"todos length":result.rowCount}});
        return
    });
};

module.exports = {getTodos, createTodos}