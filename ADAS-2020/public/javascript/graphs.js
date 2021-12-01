/*  Canvas.js  */

//Connect PostgreSQL DB
/* 
https://www.tothenew.com/blog/connect-to-postgresql-using-javascript/
var pg = require('pg');v//include dependency into your code
var connectionString = "postgres://userName:password@serverName/ip:5432/nameOfDatabase"; //provide connection string for the postgreSQL client, port generally is default one i.e. 5432
var pgClient = new pg.Client(connectionString); //Instantiate the client for Postgres database
pgClient.connect(); //Connect to database by using following command
var query = pgClient.query("SELECT id from Customer WHERE name = 'customername'"); //Execute the query using the following statement
query.on("row", function(row, result){result.addRow(row);});//Get the result set using
*/

//Pull data from CSV file
/*
var csv = require('jquery-csv');//module to parse CSV using jquery
var csvFile = "public/data/rainLogger_Fulton In Hours_sept26";

$.csv.toObjects(csvFile);
*/

/*
function getDataPointsFromCSV(csv) {
    var dataPoints = csvLines = points = [];
    csvLines = csv.split(/[\r?\n|\r|\n]+/);
    
    for (var i = 1; i < csvLines.length; i++)
        if (csvLines[i].length > 0) {
            points = csvLines[i].split(",");
            dataPoints.push({
                x: parseFloat(points[1]), 
                y: parseFloat(points[3]) 		
        });
    }
    return dataPoints;
}
*/

var filepath = "http://10.10.9.160/javascript/data/test.txt";//"data/rainLogger_Fulton In Hours_sept26";

var dataPoints = [];
function getDataPointsFromTXT(txt) {
    var dataPoints = txtLines = points = [];
    txtLines = txt.split(/[\r?\n|\r|\n]+/);         

    for (var i = 0; i < txtLines.length; i++)
        if (txtLines[i].length > 0) {
            points = txtLines[i].split(",");
            dataPoints.push({ 
                x: new Date(points[0]), 
                y: parseFloat(points[1]) 		
            });
        }
    return dataPoints;
}

//Create Chart
var barColors = "red";
$.get(filepath), function(data){
    var rainLoggerChart = new Chart("rainLoggerChart", {
        type: "bar",
        data: {
            dataPoints: getDataPointsFromTXT(data),
            labels: x,
            datasets: [{
                fill: false,
                backgroundColor: barColors,
                borderColor: "rgba(255, 255, 255, 1.2)",
                data: y
            }]
        },
        options: {
            legend: {display: false},
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
    rainLoggerChart.render();
}


/*DUMMY DATA*/
var xValues2 = ["6PM", "7PM", "8PM", "9PM", "10PM", "11PM", "12AM", "1AM", "2AM"];
var yValues2 = [55, 49, 44, 24, 15, 16, 19, 20, 21];

var barColors = "red";

//Create Chart
var levelLoggerChart = new Chart("levelLoggerChart", {
    type: "bar",
    data: {
        labels: xValues2,
        datasets: [{
            fill: false,
            backgroundColor: barColors,
            borderColor: "rgba(255, 255, 255, 1.2)",
            data: yValues2
        }]
    },
    options: {
        legend: {display: false},
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
levelLoggerChart.render();

//Populate Last Update at Bottom of page
window.onload = getForecast('weather.gov');
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

function getForecast(apiName) {
    apiName = apiName.replace('.', '');
    let url = "/api/forecast/" + apiName;
    load(url, "GET", '', response => {
        populateLastUpdate(response);
    });
};


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