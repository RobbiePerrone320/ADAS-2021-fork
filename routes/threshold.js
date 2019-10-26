var mysql = require('mysql');
var con = mysql.createConnection({
    database: 'rhinebeck',
    host: 'localhost',
    user: 'root',
    password: 'rhinebeck2019'
});

con.connect(function(err){
    if(err) throw err;
    else console.log("Connected!");
});


exports.insertThresholds = function(req){
    response = {
        stage1: req.query.stage1,
        stage2: req.query.stage2,
        stage3: req.query.stage3,
        stage4: req.query.stage4,
        stage5: req.query.stage5
    }
    console.log(response);
    let query = `UPDATE threshold
                SET stage1 = ${req.query.stage1}, stage2 = ${req.query.stage2}, stage3 = ${req.query.stage3}, stage4 = ${req.query.stage4}, stage5 = ${req.query.stage5}
                WHERE thresholdID = 1;`;
    con.query(query, function(err){
        if(err) throw err;
        else console.log("Data successfully updated!");
    });
}

//Broken
exports.getThresholds = function(res){
    let query = `SELECT stage1, stage2, stage3, stage4, stage5 from threshold;`
    con.query(query, function(err, table){
        if(err) throw err;
        else {
            response = table;
            console.log("What is this? " + response);
        }
    });
}