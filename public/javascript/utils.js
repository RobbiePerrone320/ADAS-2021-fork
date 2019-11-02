window.onload = getData('/getData', parseData);

/** 
 * @param {XMLHttpRequest} xhttp The response object from the database
 */
function parseData(xhttp){
    let obj = JSON.parse(xhttp.responseText);
    return obj;
}

/**
 * @param {JSON} obj JSON containing the threshold and discharge data
 * Checks to see what range the amount of rain predicted falls into and displays graphics accordingly.
 */
function amountChecker(obj){
    let discharge = obj["discharge"];
    let stage1 = obj["stage1"];
    let stage2 = obj["stage2"];
    let stage3 = obj["stage3"];
    let stage4 = obj["stage4"];
    //let stage5 = obj["stage5"];

    let elem = document.getElementById("dischargeAmount");
    elem.innerHTML = discharge;

    if(discharge >= 0 && discharge <= stage1 - 1) {
        elem.style.color = "#65FC5A";
        document.getElementById("warning").style.display = "none";
    }
    else if(discharge >= stage1 && discharge <= stage2 - 1) {
        elem.style.color = "#65FC5A";
        document.getElementById("warning").src = "/resources/warning.png";
        document.getElementById("warning").style.display = "initial";
    }
    else if(discharge >= stage2 && discharge <= stage3 - 1) {
        elem.style.fontSize = 35;
        elem.style.color = "orange";
        document.getElementById("warning").src = "/resources/warning.png";
        document.getElementById("warning").style.display = "initial";
    }
    else if(discharge >= stage3 && discharge <= stage4) {
        elem.style.fontSize = 35;
        elem.style.color = "#FC3C3C";
        document.getElementById("warning").src = "/resources/warning.png";
        document.getElementById("warning").style.display = "initial";
    }
    else {
        elem.style.fontSize = 35;
        elem.style.color = "red";
        document.getElementById("warning").src = "/resources/danger.png";
        document.getElementById("warning").style.display = "initial";
    }
}

/**
 * Updates the drop-down menu to reflect which source was selected.
 */
$(document).ready(function(){
    $(".dropdown-menu li a").click(function(){
        let selText = $(this).text();
        $(".dropdown-toggle").html(selText + " <span class='caret'></span>");
    });
});

/**
 * Gets the threshold and discharge values from the database
 * @param {String} url URL to locate resource 
 * @param {parseData} callback Name of the function to execute upon receiving data
 */
function getData(url, callback){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            amountChecker(callback(this));
            populateThresholds(callback(this));
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

/**
 * Populates the Threshold modal's table with the values
 * @param {xmlHttpRequest} xhttp xmlHttpRequest response object
 */
function populateThresholds(obj){
    const MAX_THRESHOLD = 5;
    for(let i = 1; i <= MAX_THRESHOLD; i++){
        let stage = "stage" + i;
        document.getElementById(stage + "TD").innerHTML = obj[stage] + "m<sup>3</sup>";
    }
}