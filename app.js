var express = require('express');
var mysql = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
var api = require('./routes/api');
var model = require('./routes/model');
var emailService = require('./routes/email');
var thresholdService = require('./routes/threshold');
var connection = require("./util/database");
var config = require('./config.json');

var app = express();
var WEATHERGOV_STR = config.externalAPIs.weathergov.url;
var DARKSKY_STR = config.externalAPIs.darksky.url;
var OPENWEATHER_STR = config.externalAPIs.openweathermap.url;

// Ensure express sees the whole public folder
app.use(express.static(path.join(__dirname, 'public')));

// Allow Express/Node to handle POST requests
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// in hours
var updateInterval = 24;
const msToHour = 3600000;

// start listening on port 8080
app.listen(config.server.port, function(){
    console.log("Server is running on port", config.server.port);
    // fill the URL array
    api.buildApiRequestURLs();
    // get initial weather data when server starts
    api.updateWeatherData(connection, success => {
        if (success) {
            console.log("Successful updates everywhere.");
            model.getRefreshRate(connection, refreshRate => {
                updateInterval = refreshRate;
                console.log("Interval: ", updateInterval);
            });
        } else {
            console.error("An api update failed");
        }
    });
});

setTimeout(checkInterval, updateInterval * msToHour);

// update every updateInterval hours converted to milliseconds
function checkInterval() {
    console.log("\n\n===========================================================");
    api.updateWeatherData(connection, success => {
        if (success) {
            model.getRefreshRate(connection, refreshRate => {
                updateInterval = refreshRate;
                console.log("Interval: ", updateInterval);
                setTimeout(checkInterval, updateInterval * msToHour);
            });
        } else {
            console.log("Update of External API data failed. Update interval set to 12.");
            updateInterval = 12;
        }
    });
}

// when the server is requested, this is shown
app.get('/', function(err, request, response) {
    console.log('Landing page requested');
    console.log('Sending path: ' + path.join(__dirname, '../public', 'index.html'));
    
    response.sendFile(path.join(__dirname, '/public', 'index.html'));
});


app.get('/api/forecast/weathergov', (req, resp) => {
    console.log('Getting Weather.gov forecast...')
    connection.query(buildForecastQuery(WEATHERGOV_STR), (err, result) => {
        console.log(err, "-", result);
        res.send(JSON.stringify(result[0]));
    });
});

app.get('/api/forecast/darksky', (req, resp) => {
    console.log('Getting DarkSky forecast...')
    connection.query(buildForecastQuery(DARKSKY_STR), (err, result) => {
        console.log(err, "-", result);
        res.send(JSON.stringify(result[0]));
    });
});

app.get('/api/forecast/openweather', (req, resp) => {
    console.log('Getting OpenWeather forecast...')
    connection.query(buildForecastQuery(OPENWEATHER_STR), (err, result) => {
        console.log(err, "-", result);
        res.send(JSON.stringify(result[0]));
    });
});


//Email Routes
app.post("/saveEmail", function(req, res){
    emailService.insertEmail(req, connection);
    res.redirect("/");
});

app.post("/removeEmail", function(req, res){
    emailService.removeEmail(req, connection);
    res.redirect("/");
});


//Threshold Routes
app.post("/saveThreshold", function(req, res){
    thresholdService.insertThresholds(req, connection);
    res.redirect("/");
});

app.get("/getData", function(req, res){
    con.query(`SELECT stage1, stage2, stage3, stage4, stage5, discharge FROM threshold, weatherData;`, (err, result) => {
        if(err) throw err;
        else {
            res.send(JSON.stringify(result[0]));
        }
    });
});

// Helper functions

function buildForecastQuery(api) { 
    return "SELECT * FROM weatherData WHERE sourceURL = '" + api + "';";
}
