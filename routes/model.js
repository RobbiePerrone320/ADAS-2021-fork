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

module.exports.calculateDurations = calculateDurations;
module.exports.calculateExpected = calculateExpected;