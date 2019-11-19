const WEATHERGOV_STR = 'api.weather.gov';
const DARKSKY_STR = 'api.darksky.net';
const OPENWEATHER_STR = 'api.openweathermap.org';

// weather.gov is the default source when the page loads.
window.onload = getData('/api/getData/' + WEATHERGOV_STR, "GET");
window.onload = getForecast('weather.gov');
window.onload = populateDaysOfWeek();

/** 
 * Given a JSON, parses the data for its values.
 * @param {XMLHttpRequest} xhttp The response object from the database.
 */
function parseData(json){
    let obj = JSON.parse(json);
    return obj;
}

/**
 * Checks to see what range the amount of rain predicted falls into and displays graphics accordingly.
 * @param {JSON} obj JSON containing the threshold and discharge data.
 */
function updateDischargeGraphics(obj){
    let discharge = obj["discharge"];
    let stage1 = obj["stage1"];
    let stage2 = obj["stage2"];
    let stage3 = obj["stage3"];
    let stage4 = obj["stage4"];

    const DISCHARGE_VAL = document.getElementById("dischargeAmount");
    const WARN_IMAGE = document.getElementById("warning");
    DISCHARGE_VAL.innerHTML = discharge;

    if(discharge >= 0 && discharge <= stage1 - 1) {
        DISCHARGE_VAL.style.color = "#65FC5A";
        WARN_IMAGE.style.display = "none";
    }
    else if(discharge >= stage1 && discharge <= stage2 - 1) {
        DISCHARGE_VAL.style.color = "#FCE703";
        WARN_IMAGE.style.display = "none";
    }
    else if(discharge >= stage2 && discharge <= stage3 - 1) {
        DISCHARGE_VAL.style.color = "orange";
        WARN_IMAGE.style.display = "none";
    }
    else if(discharge >= stage3 && discharge <= stage4) {
        DISCHARGE_VAL.style.color = "#EA6E6E";
        WARN_IMAGE.src = "/images/warning.png";
        WARN_IMAGE.style.display = "initial";
        WARN_IMAGE.title = 'Unusually high amount of precipitation predicted.';
    }
    else {
        DISCHARGE_VAL.style.color = "red";
        WARN_IMAGE.src = "/images/danger.png";
        WARN_IMAGE.style.display = "initial";
        WARN_IMAGE.title = 'Potentially dangerous amount of precipitation predicted.';
    }
}

/**
 * Updates the drop-down menu to reflect which source was selected.
 */
$(document).ready(function(){
    $(".dropdown-menu li a").click(function(){
        let selText = $(this).text();
        $(".dropdown-toggle").html(selText + " <span class='caret'></span>");

        getForecast(selText);
        let url = '/api/getData/';
        if (selText === 'weather.gov') {
            getData(url + WEATHERGOV_STR, 'GET');
        } 
        else if (selText === 'darksky.net') {
            getData(url + DARKSKY_STR, 'GET');
        } 
        else if (selText === 'openweathermap.org') {
            getData(url + OPENWEATHER_STR, 'GET');
        } 
    });
});

/**
 * Sends an XmlHttpRequest to the server.
 * @param {string} url The URL to locate resource.
 * @param {string} method The HTTP method to use when accessing data.
 * @param {*} callback The name of the function to execute upon receiving data.
 */
function load(url, method, callback) {
    var xhr = new XMLHttpRequest();
  
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if(callback) callback(xhr.response);
      }
    }
  
    xhr.open(method, url, true);
    if(method != "GET") {
        xhr.setRequestHeader("Content-Type", 
            "application/x-www-form-urlencoded");
        if(url == "/api/email"){
            if(method == "DELETE") {
                xhr.send(`email_address=
                    ${document.getElementById("emailToRemove").value}`);
            }
            else if(method == "POST") {
                xhr.send(`first_name=${document.getElementById("fName").value}
                    &last_name=${document.getElementById("lName").value}&`
                + `email_address=${document.getElementById("emailToAdd").value}
                    &phone_number=${document.getElementById("phone").value}`);
            }
        }
        if(url == "/api/threshold") {
            xhr.send(`stage1=${document.getElementById("stage1").value}
                &stage2=${document.getElementById("stage2").value}&`
            + `stage3=${document.getElementById("stage3").value}
                &stage4=${document.getElementById("stage4").value}`);
        }

        clearInput();
        closeModal();

    }
    else xhr.send('');
}

/**
 * Gets the threshold and discharge values from the database and returns them to be parsed and evaulated for display.
 * @param {string} url The URL to locate resource.
 * @param {string} method The HTTP method to use when accessing data.
 */
function getData(url, method) {
    load(url, method, response => {
        let json = parseData(response);
        updateDischargeGraphics(json);
        populateThresholds(json);
    });
}

/**
 * Sends data to the database for storage.
 * @param {string} url The URL of where to send the data.
 * @param {string} method The HTTP method to use when sending the data.
 */
function sendData(url, method, callback){
    load(url, method, callback);
}

function getForecast(apiName) {
    apiName = apiName.replace('.', ''); // remove the .
    let url = "/api/forecast/" + apiName;
    load(url, "GET", response => {
        let json = parseData(response);
        populateForecast(json);
        populateLastUpdate(json);
        populateValveTimes(json);
    });
};

/**
 * Populates the Threshold modal's table with the values.
 * @param {xmlHttpRequest} xhttp The xmlHttpRequest response object.
 */
function populateThresholds(obj){
    const MAX_THRESHOLD = 5;
    for (let i = 1; i < MAX_THRESHOLD; i++){
        let stage = "stage" + i;
        document.getElementById(stage + "TD").innerHTML = obj[stage] 
            + "m<sup>3</sup>";
    }
}

function populateForecast(obj) {
    const MAX_FORECAST = 4;
    for (let i = 1; i <= MAX_FORECAST; i++) {
        let amount = "amount" + i;
        let dayField = 'day' + i;
        let value = 0;
        if(parseFloat(obj[dayField]) != 0) value = obj[dayField].toFixed(2);
        document.getElementById(amount).innerHTML = value;
    }
    document.getElementById('dischargeAmount').innerHTML = obj['discharge'];
}

function populateLastUpdate(obj) {
    let lastUpdateHour = obj['lastUpdate'];
    let lastUpdateSec = parseISOString(lastUpdateHour).getTime();
    let currentDateSec = new Date().getTime();
    const msToHour = 3600000;
    
    lastUpdateSec = currentDateSec - lastUpdateSec;
    document.getElementById('updateTime').innerHTML = Math.round(lastUpdateSec / msToHour);
}

function populateValveTimes(obj) {
    let twoValvesField = 'twoValves';
    let threeValvesField = 'threeValves';
    let fourValvesField = 'fourValves';

    document.getElementById('hour' + 1).innerHTML = obj[twoValvesField];
    document.getElementById('hour' + 2).innerHTML = obj[threeValvesField];
    document.getElementById('hour' + 3).innerHTML = obj[fourValvesField];
}

function populateDaysOfWeek(){
    let currentDate = new Date();
    let day3Date = new Date();
    let day4Date = new Date();

    day3Date.setDate(currentDate.getDate() + 2);
    day4Date.setDate(currentDate.getDate() + 3);

    var options = { weekday: 'long'};
    let day3String = new Intl.DateTimeFormat('en-US', options).format(day3Date);
    let day4String = new Intl.DateTimeFormat('en-US', options).format(day4Date);
    
    document.getElementById('day3').innerHTML = day3String;
    document.getElementById('day4').innerHTML = day4String;
}

/**
 * If an email is validated, that email is then removed from the database.
 */
function removeEmail(){
    if(isValidEmail(document.getElementById("emailToRemove").value)) sendData("/api/email", "DELETE");
}

/**
 * If an email and its corresponding data is validated, it is then added to the database.
 */
function addEmail(){
    if(verifyNotification()) sendData("/api/email", "POST");
}

/**
 * If all thresholds values are valid, they are updated in the database.
 */
function updateThreshold(){
    if(verifyThreshold()) sendData("/api/threshold", "PUT", () => {
        let currentSource = 'api.' + $(curSourceBtn).text();
        currentSource = currentSource.replace(/\s+/g, '');
        const URL = '/api/getData/';
        getData(URL + currentSource, 'GET');
    });
}

function parseISOString(str) {
    var b = str.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}