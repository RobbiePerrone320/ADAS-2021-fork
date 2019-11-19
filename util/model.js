// Model calculation functions

/* Calculate the expected total precipitation for the watershed */
function calculateExpected(expectedPrecip) {
    // step 2: volume for watershed
    let volume = expectedPrecip * 27.2 * 1000;
    
    // step 3: safety value adjustment
    volume = volume * 0.7;
    
    // volume in m^3
    return volume;
}

/* Calculate the durations the valves should be open for a given volume */
function calculateDurations(volume) {
    // valveDischarges are static and are calculated with (maxDischarge - 4.25) * 3600
    let valveRates = [3420, 4752, 6192];
    let durations = [];
    valveRates.forEach(value => {
        durations.push(volume/value);
    });
    return durations;
}

/* Determine the active threshold stage based on model calculations */
function getRefreshRate(connection, callback) {
    getAvgDischarge(connection, avgDischarge => {
        getThresholds(connection, thresholds => {
            let refreshRate = 0; // in hours
            if (avgDischarge <= thresholds.stage2) {
                refreshRate = 24;
            } 
            else if (avgDischarge > thresholds.stage2 + 1 &&
                    avgDischarge <= thresholds.stage3) {
                refreshRate = 12;
            } 
            else if (avgDischarge > thresholds.stage3 + 1 &&
                    avgDischarge <= thresholds.stage4) {
                refreshRate = 6;
            } 
            else if (avgDischarge > thresholds.stage4 + 1) {
                refreshRate = 3;
            }
            callback(refreshRate);
        });
    });
}

function getAvgDischarge(connection, callback) {
    let discharges;
    connection.query("SELECT * FROM weatherData;", (err, row) => {
        if(err) {
            console.error("There was an error: ", err);
        } 
        else {
            if (row && row.length) {
                //console.log("rows found! Querying table...");
                connection.query("SELECT discharge FROM weatherData;", (err, result) => {
                    if(err) {
                        console.error("There was an error: ", err);
                    } 
                    else {
                        discharges = result;
                        // console.log("discharges   ", discharges);
                    }
                    let avgDischarge = 0;
                    discharges.forEach(row => {
                        avgDischarge += row.discharge;
                    });
                    avgDischarge /= 3;
                    callback(avgDischarge);
                });
            }
        }
    });
}

function getThresholds(connection, callback) {
    let thresholds;
    connection.query("SELECT * FROM threshold WHERE thresholdID = 0;", 
    (err, row) => {
        if(err) {
            console.error("There was an error: ", err);
        }
        else {
            if (row && row.length) {
                //console.log("rows found! Querying table...");
                connection.query("SELECT * FROM threshold;", (err, result) => {
                    if(err) {
                        console.error("There was an error: ", err);
                    } 
                    else {
                        thresholds = result[0];
                        // console.log("thresholds   ", thresholds);
                        callback(thresholds);
                    }
                });
            }
        }
    });
}

module.exports.calculateDurations = calculateDurations;
module.exports.calculateExpected = calculateExpected;
module.exports.getRefreshRate = getRefreshRate;