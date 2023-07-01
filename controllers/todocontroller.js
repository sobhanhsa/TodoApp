const {pool} = require("../database/dbquery");

function getTodos(req, res) {

    pool.query("SELECT * FROM todo WHERE UserId = $1",[parseInt(req.user.id)],(error , result) => {
        console.log("in pool")
        if (error) {
            res.status(500).json({"data":{"message":"please try later"}});
            return
        }
        res.status(200).json({"data":{"user":req.user,"todos":result.rows,"todos length":result.rowCount}});
        return
    });

}

module.exports = {getTodos}