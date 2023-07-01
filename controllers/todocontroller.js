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

function createTodo(req, res) {
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
        res.status(201).json({"data":{"user":req.user,"createdtodo":result.rows[0],"todos length":result.rowCount}});
        return
    });
};

function deleteTodo(req, res) {
    if ((!req.params.id) || (req.params.id === "")) {
        res.status(400).json({"data":{"message":"please implement id in url"}})
        return
    };

    pool.query("DELETE FROM todo WHERE ID = $1 AND UserId = $2 RETURNING *",[parseInt(req.params.id), req.user.id],
    (error, result) => {
        if (error) {
            res.status(500).json({"data":{"message":"please try later"}});
            return
        };

        if (result.rowCount === 0 ) {
            res.status(400).json({"data":{"message":"you dont have any todo with given id","todos length":0}});
            return
        };

        res.status(202)
            .json({"data":{"user":req.user,"deleted todo":result.rows[0],"todos length":result.rowCount}});
        return
    });
};

module.exports = {
    getTodos,
    createTodo,
    deleteTodo,
}