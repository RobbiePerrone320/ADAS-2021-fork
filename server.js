var express = require('express');
var path = require('path');
var mysql = require("mysql");
var app = express();
var bodyParser = require('body-parser');
var emailService = require('./routes/email');
var thresholdService = require('./routes/threshold');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

var server = app.listen(8080, function(){
    var host = server.address().address;
    var port = server.address().port;
});

var con = mysql.createConnection({
    database: 'rhinebeck',
    host: 'localhost',
    user: 'root',
    password: 'rhinebeck2019'
});


//In order for this to work properly, the "node *.js" command must be run from the root of the project directory.
    //This is also assuming the files are locally linked properly. They are linked relative to the public folder's view.
app.use(express.static('public'));



app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/public", "index.html"));
});

app.post("/saveEmail", function(req, res){
    emailService.insertEmail(req);
    res.redirect("/");
});

app.post("/removeEmail", function(req, res){
    emailService.removeEmail(req);
    res.redirect("/");
})

app.post("/saveThreshold", function(req, res){
    thresholdService.insertThresholds(req);
    res.redirect("/");
});

app.get("/getThresholds", function(req, res){
    con.query(`SELECT stage1, stage2, stage3, stage4, stage5 from threshold;`, (err, result) => {
        if(err) throw err;
        else {
            res.send(JSON.stringify(result[0]));
        }
    });
});