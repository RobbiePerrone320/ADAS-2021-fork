var express = require('express');
var mysql = require('mysql');
var path = require('path');
var api = require('./routes/api');

var app = express();

// make sure express sees the whole public folder
app.use(express.static(path.join(__dirname, 'public')));

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



// start listening on port 3000
app.listen(3000, function(){
    console.log("Server is running on port 3000");
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
    
    response.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Forecast routes

app.get('/forecast/weathergov', (req, resp) => {
    console.log('Getting Weather.gov forecast...')
    connection.query("SELECT * FROM apidata WHERE api = 'weathergov';", (err, result) => {
        console.log(err, "-", result);
        resp.send(JSON.stringify(result[0]));
    });
})

app.get('/forecast/darksky', (req, resp) => {
    console.log('Getting DarkSky forecast...')
    connection.query("SELECT * FROM apidata WHERE api = 'darksky';", (err, result) => {
        console.log(err, "-", result);
        resp.send(JSON.stringify(result[0]));
    });
})

app.get('/forecast/openweather', (req, resp) => {
    console.log('Getting OpenWeather forecast...')
    connection.query("SELECT * FROM apidata WHERE api = 'openweather';", (err, result) => {
        console.log(err, "-", result);
        resp.send(JSON.stringify(result[0]));
    });
})

app.get('/forecast/discharge', (req, resp) =>{
    console.log('Getting discharge values...');
    connection.query("SELECT discharge FROM apidata;", (err, result) => {
        console.log(err, "-", result);
        resp.send(JSON.stringify(result[0]));
    })
})

// Database Requests

app.get('/users', function(request, response) {
    console.log('Getting users...')
    connection.query("SELECT firstname FROM users", (error, result) => {
        if(error) throw error;
        console.log(result);
        response.send(result);
    });
});