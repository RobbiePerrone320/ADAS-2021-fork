var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var apiService = require('./routes/api');
var emailService = require('./routes/email');
var modelService = require('./util/model');
var connection = require("./util/database");
var config = require('./config.json');

var app = express();
const WEATHERGOV_STR = config.externalAPIs.weathergov.url;
const DARKSKY_STR = config.externalAPIs.darksky.url;
const OPENWEATHER_STR = config.externalAPIs.openweathermap.url;

// Ensure express sees the whole public folder
app.use(express.static(path.join(__dirname, 'public')));

// Allow Express/Node to handle POST requests
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// in hours
var updateInterval = 24;
const msToHour = 3600000;
let timerId;

// start listening on port 8080
app.listen(config.server.port, () => {
    console.log("Server is running on port", config.server.port);
    // fill the URL array
    apiService.buildApiRequestURLs();
    // get initial weather data when server starts
    apiService.updateWeatherData(connection, success => {
        if (success) {
            console.log("Successful updates everywhere.");
            modelService.getRefreshRate(connection, refreshRate => {
                updateInterval = refreshRate;
                console.log("Interval: ", updateInterval);
                timerId = setTimeout(checkInterval, updateInterval * msToHour);
                if (requiresEmail()) emailService.sendEmail(connection);
            });
        } else {
            console.error("An api update failed");
        }
    });
});

// update every updateInterval hours converted to milliseconds
function checkInterval() {
    console.log("\n\n===========================================================");
    apiService.updateWeatherData(connection, success => {
        if (success) {
            modelService.getRefreshRate(connection, refreshRate => {
                updateInterval = refreshRate;
                console.log("Interval: ", updateInterval);
                timerId = setTimeout(checkInterval, updateInterval * msToHour);
                if (requiresEmail()) emailService.sendEmail(connection);
            });
        } else {
            console.log("Update of External API data failed. Update interval set to 12.");
            updateInterval = 12;
        }
    });
}

// when the server is requested, this is shown
app.get('/', (err, request, response) => {
    console.log('Landing page requested');
    console.log('Sending path: ' + path.join(__dirname, '../public', 'index.html'));
    
    response.sendFile(path.join(__dirname, '/public', 'index.html'));
});


app.get('/api/forecast/weathergov', (req, res) => {
    connection.query(buildForecastQuery(WEATHERGOV_STR), (err, result) => {
        if(err) throw err;
        else {
            res.send(JSON.stringify(result[0]));
        }
    });
});

app.get('/api/forecast/darkskynet', (req, res) => {
    connection.query(buildForecastQuery(DARKSKY_STR), (err, result) => {
        if(err) {
            throw err;
        }
        else {
            res.send(JSON.stringify(result[0]));
        }
    });
});

app.get('/api/forecast/openweathermaporg', (req, res) => {
    connection.query(buildForecastQuery(OPENWEATHER_STR), (err, result) => {
        if(err) {
            throw err;
        }
        else {
            res.send(JSON.stringify(result[0]));
        }
    });
});


//Email Routes
app.post("/api/email", (req) => {
    emailService.insertEmail(req, connection);
});

app.delete("/api/email", (req) => {
    emailService.removeEmail(req, connection);
});


//Threshold Routes
app.put("/api/threshold", (req, res) => {
    const UPDATE_QUERY = `UPDATE threshold
    SET stage1 = ${req.body.stage1}, stage2 = ${req.body.stage2}, stage3 = ${req.body.stage3}, stage4 = ${req.body.stage4}
    WHERE thresholdID = 0;`;
    connection.query(UPDATE_QUERY, (err) => {
        if(err) {
            throw err;
        }
        else { 
            console.log("Thresholds successfully updated!");
            const SELECT_QUERY = `SELECT stage1, stage2, stage3, stage4 FROM threshold;`;
            connection.query(SELECT_QUERY, (err, result) => {
                if(err) {
                    throw err;
                }
                else{
                    console.log("Thresholds sent to the front end.");
                    res.send(JSON.stringify(result[0]));
                }
            });
        }
    });

});

app.get("/api/getData/:api", (req, res) => {
    connection.query('SELECT stage1, stage2, stage3, stage4 FROM threshold;', 
    (err, thresholdResult) => {
        if(err) {
            throw err;
        }
        else {
            connection.query("SELECT discharge FROM weatherData WHERE sourceURL = '" +
                    req.params.api + "';", (err, dischargeResult) => {
                if(err) {
                    throw err;
                }
                else {
                    let resultObj = Object.assign(thresholdResult[0], dischargeResult[0]);
                    res.send(JSON.stringify(resultObj));
                }
            });
        }
    });
});

// Helper functions
function buildForecastQuery(api) { 
    return "SELECT * FROM weatherData WHERE sourceURL = '" + api + "';";
}

function requiresEmail(interval) {
    if (interval < 24) {
        return true;
    } else {
        return false;
    }
}