var express = require('express');
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
var api = require('./routes/api');
var emailService = require('./routes/email');
var thresholdService = require('./routes/threshold');

var app = express();
var WEATHERGOV_STR = 'api.weather.gov';
var DARKSKY_STR = 'api.darksky.net';
var OPENWEATHER_STR = 'api.openweathermap.org';

// Ensure express sees the whole public folder
app.use(express.static(path.join(__dirname, 'public')));

// Allow Express/Node to handle POST requests
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Create database connection
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: 'Rhineback2019',
    database: 'damdb'
});
// in hours
var updateInterval = 24;

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
});


// start listening on port 8080
app.listen(8080, function(){
    console.log("Server is running on port 8080");
    // fill the URL array
    api.buildApiRequestURLs();
    // get initial weather data when server starts
    api.updateWeatherData(connection);
});

// update every updateInterval hours converted to milliseconds
// setInterval(() => updateWeatherData, updateInterval * 3600 * 1000);
// setInterval(() => api.updateWeatherData(connection), updateInterval * 1000);

// when the server is requested, this is shown
app.get('/', function(err, request, response) {
    console.log('Landing page requested');
    console.log('Sending path: ' + path.join(__dirname, '../public', 'index.html'));
    
    response.sendFile(path.join(__dirname, '/public', 'index.html'));
});


// Forecast Routes
app.get('/forecast/weathergov', (req, res) => {
    console.log('Getting Weather.gov forecast...')
    connection.query("SELECT * FROM weatherData WHERE sourceURL = '" + 
        WEATHERGOV_STR + "';", (err, result) => {
        console.log(err, "-", result);
        res.send(JSON.stringify(result[0]));
    });
})

app.get('/forecast/darksky', (req, res) => {
    console.log('Getting DarkSky forecast...')
    connection.query("SELECT * FROM weatherData WHERE sourceURL = '" + 
        DARKSKY_STR + "';", (err, result) => {
        console.log(err, "-", result);
        res.send(JSON.stringify(result[0]));
    });
})

app.get('/forecast/openweather', (req, res) => {
    console.log('Getting OpenWeather forecast...')
    connection.query("SELECT * FROM weatherData WHERE sourceURL = '" +
        OPENWEATHER_STR + "';", (err, result) => {
        console.log(err, "-", result);
        res.send(JSON.stringify(result[0]));
    });
})


//Email Routes
app.post("/saveEmail", function(req, res){
    emailService.insertEmail(req, connection);
    res.redirect("/");
});

app.post("/removeEmail", function(req, res){
    emailService.removeEmail(req, connection);
    res.redirect("/");
})


//Threshold Routes
app.post("/saveThreshold", function(req, res){
    thresholdService.insertThresholds(req, connection);
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