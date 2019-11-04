/**
 * @param {XMLHttpRequest} req The POST request containing the thresholds to insert into the database
 * @param {DatabaseConnection} con The MySQL datbase connection where the data is stored
 * Inserts thresholds into the database
 */
function insertThresholds(req, con){
    let query = `UPDATE threshold
                SET stage1 = ${req.body.stage1}, stage2 = ${req.body.stage2}, stage3 = ${req.body.stage3}, stage4 = ${req.body.stage4}, stage5 = ${req.body.stage5}
                WHERE thresholdID = 1;`;
    con.query(query, function(err){
        if(err) throw err;
        else console.log("Data successfully updated!");
    });
}

module.exports.insertThresholds = insertThresholds;