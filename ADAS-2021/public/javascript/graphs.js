/*  Canvas.js Library  */

//const e = require("express");

//Connect PostgreSQL DB - CODE NOT FINISHED
/* 
https://www.tothenew.com/blog/connect-to-postgresql-using-javascript/
var pg = require('pg');v//include dependency into your code
var connectionString = "postgres://userName:password@serverName/ip:5432/nameOfDatabase"; //provide connection string for the postgreSQL client, port generally is default one i.e. 5432
var pgClient = new pg.Client(connectionString); //Instantiate the client for Postgres database
pgClient.connect(); //Connect to database by using following command
var query = pgClient.query("SELECT id from Customer WHERE name = 'customername'"); //Execute the query using the following statement
query.on("row", function(row, result){result.addRow(row);});//Get the result set using
*/

/*
//CODE ATTEMPTED TO ENABLE CORS ON THE LOCAL FILES. 
//Code was scrappped for different solution that is displayed in the changes made to the app.js file
//Changes can be read about in the documentation
var myRequest = new Request(filepath);
var myMode = myRequest.mode; // returns "cors" by default
myRequest.type = "blob";
var data = "";

function storeResult(result) {
    data = result;
}

var request = new XMLHttpRequest();
request.open('GET', filepath, true);
request.responseType = 'blob';
request.onload = function() {
    var reader = new FileReader();
    reader.readAsText(request.response)
    //reader.readAsDataURL(request.response);
    reader.onload = function(e) {
        //console.log('DataURL:', e.target.result);
        console.log(e.target.result);
        storeResult(e.target.result);
    };
};
request.send();
*/
/*
* RAINLOGGER DATA GRAPHING
*/
var filepath1 = "/data/tests1";
var dataPoints1 = [];
var xValues1 = [];
var yValues1 = [];
var dataArr1 = [];
var barColors1 = "red";

function getDataPointsFromJSONTest1() {
    for (var i = 1; i < dataArr1.length; i++) {
        console.log(dataArr1[i]);
        dataArr1[i]['Inches'].replace("in.", "");
        xValues1.push((dataArr1[i]['Time']));
        yValues1.push(parseInt(dataArr1[i]['Inches']));
    }
}

fetch(filepath1)
    .then(res => res.json())
    .then(data => dataArr1 = data)
    .then(() => console.log(dataArr1)).then(() => createRainloggerChart());

//Create Chart
function createRainloggerChart() {
    getDataPointsFromJSONTest1();
    var rainloggerChart = new Chart("rainloggerChart", {
        type: "bar",
        data: {
            labels: xValues1,
            datasets: [{
                label: "Rainfall in Inches",
                fill: false,
                backgroundColor: barColors1,
                borderColor: "rgba(255, 255, 255, 1.2)",
                data: yValues1
            }]
        },
        options: {
            legend: {
                display: true,
                onClick: false,
                labels: {
                    fontColor: "white",
                    fontFamily: "keepcalm",
                    fontSize: 10
                }
            },
            labels: {
                fontColor: "white",
                fontSize: 18
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        display: true ,
                        color: "#FFFFFF"
                    },
                    ticks: {
                        fontColor: "white",
                        fontFamily: "bungee",
                        fontSize: 20,
                        stepSize: 5,
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: true,
                        color: "#FFFFFF"
                    },
                    ticks: {
                        fontColor: "white",
                        fontFamily: "bungee",
                        fontSize: 20,
                        stepSize: 5,
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    rainloggerChart.render();
}

/*
* LEVELOGGER DATA GRAPHING
*/
var filepath2 = "/data/tests2";
var dataPoints2 = [];
var xValues2 = [];
var yValues2 = [];
var dataArr2 = [];
var barColors2 = "royalblue";

function getDataPointsFromJSONTest2() {
    for (var i = 1; i < dataArr2.length; i++) {
        console.log(dataArr2[i]);
        dataArr2[i]['Inches'].replace("in.", "");
        xValues2.push((dataArr2[i]['Time']));
        yValues2.push(parseInt(dataArr2[i]['Inches']));
    }
    //console.log(dataPoints2);
}

fetch(filepath2)
    .then(res => res.json())
    .then(data => dataArr2 = data)
    .then(() => console.log(dataArr2)).then(() => createLeveloggerChart());

//Create Chart
function createLeveloggerChart() {
    getDataPointsFromJSONTest2();
    var leveloggerChart = new Chart("leveloggerChart", {
        type: "bar",
        data: {
            labels: xValues2,
            datasets: [{
                label: "Level of Water in Inches",
                fill: false,
                backgroundColor: barColors2,
                borderColor: "rgba(255, 255, 255, 1.2)",
                data: yValues2
            }]
        },
        options: {
            legend: {
                display: true,
                onClick: false,
                labels: {
                    fontColor: "white",
                    fontFamily: "keepcalm",
                    fontSize: 10
                }
            },
            labels: {
                fontColor: "white",
                fontSize: 18
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        display: true ,
                        color: "#FFFFFF"
                    },
                    ticks: {
                        fontColor: "white",
                        fontFamily: "bungee",
                        fontSize: 20,
                        stepSize: 5,
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: true,
                        color: "#FFFFFF"
                    },
                    ticks: {
                        fontColor: "white",
                        fontFamily: "bungee",
                        fontSize: 20,
                        stepSize: 5,
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    leveloggerChart.render();
}

/**
* THIS SECTION POPULATES THE BOTTOM OF THE graphs.html PAGE
* The code is taken from the urils.js file and then edited to 
* include only the necessary functions to populate the bottom 
* of the graphs.html page
* Includes the Notifications button functions
* Includes the Last Update
* Includes the Threshold button functions
*/
const DARKSKY_STR = 'api.darksky.net';
window.onload = getAndPopulateThresholdData('/api/getData/' + DARKSKY_STR, "GET", "");
window.onload = getForecast('darksky.net');
/**
 * Sends an XmlHttpRequest to the server.
 * @param {string} url The URL to locate the resource.
 * @param {string} method The HTTP method to use when accessing data.
 * @param {string} body The data to send to the server.
 * @param {*} callback The name of the function to execute upon receiving data.
 */
function load(url, method, body, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if(xhr.status){  
            if (xhr.status == 200 || xhr.status == 201){
                clearInput();
                closeModal();
            }
            if (xhr.response) callback(JSON.parse(xhr.response));
        }
    }

    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(body);
}

/**
 * Gets the threshold and discharge values from the database and returns them to be parsed and evaulated for display.
 * @param {string} url The URL to locate the resource.
 * @param {string} method The HTTP method to use when accessing data.
 * @param {string} body The data to send to the server.
 */
function getAndPopulateThresholdData(url, method, body) {
    load(url, method, body, response => {
        populateThresholds(response);
    });
}

function getForecast(apiName) {
    apiName = apiName.replace('.', '');
    let url = "/api/forecast/" + apiName;
    load(url, "GET", '', response => {
        populateLastUpdate(response);
    });
};

/**
 * Populates the Threshold modal's table with the values.
 * @param {xmlHttpRequest} xhttp The xmlHttpRequest response object.
 */
function populateThresholds(obj){
    const MAX_THRESHOLD = 5;
    for (let i = 1; i < MAX_THRESHOLD; i++){
        let threshold = "threshold" + i;
        let stage = "stage" + i;
        document.getElementById(threshold + "TD").innerHTML = obj[stage] 
            + "m<sup>3</sup>";
    }
}

function populateLastUpdate(obj) {
    //function tick() {
    let lastUpdateHour = obj['lastUpdate'];
    let lastUpdateSec = parseISOString(lastUpdateHour).getTime();
    let currentDateSec = new Date().getTime();
    const hourToMS = 3600000;
    const minuteToMS = 60000;
    lastUpdateSec = currentDateSec - lastUpdateSec;
    let hours = Math.floor(lastUpdateSec / hourToMS);
    let minutes = Math.round(lastUpdateSec / minuteToMS);

    document.getElementById('updateHours').innerHTML = hours;
    document.getElementById('updateMinutes').innerHTML = Math.abs((hours * 60) - minutes);
}
/*}
$(document).ready(function(){
    tick();
})*/


function parseISOString(str) {
    var b = str.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

//Handle Notifications and Threshold Updates at Bottom of Page
/**
 * If an email is validated, removes the email from the database.
 */
function removeEmail(){
    let body = `email_address=${document.getElementById("emailToRemove").value}`;
    if (isValidEmail(document.getElementById("emailToRemove").value)) {
        load("/api/email", "DELETE", body, handleServerMessage);
    } 
}

/**
 * If an email and its corresponding data is validated, adds the email to the database.
 */
function addEmail(){
    let body = `first_name=${document.getElementById("fName").value}&` +
        `last_name=${document.getElementById("lName").value}&` +
        `email_address=${document.getElementById("emailToAdd").value}&` +
        `phone_number=${document.getElementById("phone").value}`;
    if (verifyNotification()) {
        load("/api/email", "POST", body, handleServerMessage);
    }
}

/**
 * If all thresholds values are valid, updates the values in the database.
 */
function updateThreshold(){
    let body = `stage1=${document.getElementById("threshold1").value}&` +
        `stage2=${document.getElementById("threshold2").value}&` +
        `stage3=${document.getElementById("threshold3").value}&` +
        `stage4=${document.getElementById("threshold4").value}`;
    const URL = '/api/getData/';
    let currentSource = 'api.' + $(curSrcBtn).text();
    currentSource = currentSource.replace(/\s+/g, '');

    if (verifyThreshold()) {
        load("/api/threshold", "PUT", body, (response) => {
            handleServerMessage(response);
            getAndPopulateThresholdData(URL + currentSource, 'GET');
        });
    }
}
/**
 * 
 * @param {JSON} response Receives the status message of the operation from the server and displays the appropriate graphics.
 */
function handleServerMessage(response){
    let message = response;
    let modal = document.getElementById("serverMessageModal");
    if(parseFloat(modal.style.opacity) > 0) return;
    if (message.status == 201 || message.status == 200){
        modal.style.borderColor = "green";
        modal.style.backgroundColor = "lightgreen";
    } else {
        modal.style.borderColor = "red";
        modal.style.backgroundColor = "lightcoral";
    }
    modal.innerHTML = message.text;
    modal.classList.add("serverMessageFadeIn");
    modal.style.opacity = "1";
    setTimeout(() => {
        modal.classList.remove("serverMessageFadeIn");
        modal.classList.add("serverMessageFadeOut");
        modal.style.opacity = "0";
    }, 3000);
    setTimeout(() => {
        modal.classList.remove("serverMessageFadeOut");
    }, 3500);
}