window.onload = amountChecker();

/**
 * Checks to see if the amount of rain predicted is greater than Xcm. If it is, make its color red.
 *  These numbers will have to be queried from the database.
 */
function amountChecker(){
    for(let i = 1; i < 5; i++){
        let elem = document.getElementById("dischargeAmount");
        let amount = parseFloat(elem.innerHTML);
        if(amount >= 0 && amount <= 4999) {
            elem.style.color = "#65FC5A";
            document.getElementById("warning").style.display = "none";
        }
        else if(amount >= 5000 && amount <= 9999) {
            elem.style.color = "#65FC5A";
            document.getElementById("warning").src = "/resources/warning.png";
            document.getElementById("warning").style.display = "initial";
        }
        else if(amount >= 10000 && amount <= 14999) {
            elem.style.fontSize = 35;
            elem.style.color = "orange";
            document.getElementById("warning").src = "/resources/warning.png";
            document.getElementById("warning").style.display = "initial";
        }
        else if(amount >= 15000 && amount <= 24999) {
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
 * Grabs the threshold data and populates the threshold modal with the placeholder values
 */
function getThresholds(url, callback){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            callback(this);
        }
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

function populateThresholds(xhttp){
    for(let i = 1; i < 6; i++){
        let stage = "stage" + i;
        document.getElementById(stage).placeholder = JSON.parse(xhttp.responseText)[stage];
    }
}