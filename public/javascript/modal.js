/**
 * @param {click} event - Click event
 * Closes the modal if clicked off
 */
window.onclick = function(event) {
    if(event.target.id == "backdrop") this.closeModal();
}

/**
 * Checks to see if a modal needs to be closed if one is open and the screen size becomes too small.
 */
window.onresize = function() {
    let emailModal = document.getElementById("emailModal");
    let thresholdModal = document.getElementById("thresholdModal");
    let errorModal = document.getElementById("errorModal");

    if($(window).width() < 575 && (emailModal.style.display == "initial" || thresholdModal.style.display == "initial")) {
        emailModal.style.display = "none";
        thresholdModal.style.display = "none";
        errorModal.style.display = "initial";
    }
}

/**
 * 
 * @param {*} event - Some event
 * Prevents expected behavior from occurring on a given object.
 * It acts as an intermediary to disable the buttons for form submission if there is bad input,
 *  but allows for quick re-enablement when input is valid.
 */
let handler = function(event){
    event.preventDefault();
}

/**
 * @param {button} btn - The respective modal's button
 * Opens a modal
 */
function openModal(btn) {
    if($(window).width() < 575) document.getElementById("errorModal").style.display = "initial";
    else {
        if(btn.id == "openEmailBtn") document.getElementById("emailModal").style.display = "initial";
        else if(btn.id == "openThresholdBtn") document.getElementById("thresholdModal").style.display = "initial";
    }
    document.getElementById("backdrop").style.display = "initial";
}

/**
 * Closes the modal
 */
function closeModal() {
    if(document.getElementById("emailModal").style.display == "initial"){
        document.getElementById("emailModal").style.display = "none";
    }
    else if(document.getElementById("thresholdModal").style.display == "initial"){
        document.getElementById("thresholdModal").style.display = "none";
    }
    else {
        document.getElementById("errorModal").style.display = "none";
    }
    document.getElementById("backdrop").style.display = "none";
}

//Solution: https://stackoverflow.com/questions/6339190/undo-preventdefault-or-better-way-to-programmatically-disable-collections-of-l
/**
 * Verifies input for the Threshold modal.
 *  Only accepts digits. Number values must be less than 2^53-1 ('safe' integers in javascript) but greater than 0.
 *      If the value is invalid (i.e. like a letter, special character -- anything not a digit) throw an error.
 *          (negative values are caught here because '-' is not a digit. Neat.)
 *      If the values are valid, then check to see if the first one is greater than 0. If not, throw an error.
 *      If they are each larger than the preceeding value then finally send the data. If not, throw an error.
 */
function verifyThreshold(){

    let validInput = /^\d+$/;
    let values = [];
    let thresholdError = document.getElementById("thresholdError");
    let errMsg = document.getElementById("threshErrMsg");

    for(let i = 1; i < 6; i++){
        let string = document.getElementById("stage" + i).value;
        if(string == ""){
            errMsg.innerHTML = "Thresholds cannot be left blank.";
            thresholdError.style.opacity = "1";
            $(this).bind('click', handler);
            return;
        }
    }

    for(let i = 1; i < 6; i++){
        let value = parseInt(document.getElementById("stage" + i).value);
        if(!validInput.test(value) || !Number.isSafeInteger(value) || value == NaN) {
            errMsg.innerHTML = "Thresholds can only be numbers.";
            thresholdError.style.opacity = "1";
            $(this).bind('click', handler);
            return;
        }
        else values[values.length] = value;
    }

    if(values[0] < 1) {
        errMsg.innerHTML = "Thresholds cannot be negative or 0.";
        thresholdError.style.opacity = "1";
        $(this).bind('click', handler);
        return;
    }

    if(values[0] < values[1] && values[1] < values[2] && values[2] < values[3] && values[3] < values[4]) {
        thresholdError.style.opacity = "0";
        closeModal();
        clearInput();
        $(this).unbind('click', handler);
    }

    else {
        $(this).bind('click', handler);
        errMsg.innerHTML = "Thresholds must be incremental.";
        thresholdError.style.opacity = "1";
    }
}

//Email regex: https://www.w3resource.com/javascript/form/email-validation.php
/**
 * Verifies input for the Notification modal
 */
function verifyNotification(){

    let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let validName = /^[a-z]{1,20}$/i;
    let validPhone = /^[0-9]{10}$/g;

    let errorElem = document.getElementById("emailError");
    let errMsg = document.getElementById("emailErrMsg");

    let email = document.getElementById("emailToAdd").value;
    let fName = document.getElementById("fName").value;
    let lName = document.getElementById("lName").value;
    let phone = document.getElementById("phone").value;

    if(fName == "" || lName == "" || email == "" || phone == "") {
        errorElem.style.opacity = 1;
        errMsg.innerHTML = "No fields can be left blank.";
        $(this).bind('click', handler);
        return;
    }
    if(!validName.test(fName)) {
        errorElem.style.opacity = 1;
        errMsg.innerHTML = "Invalid first name. Letters only.";
        $(this).bind('click', handler);
        return;
    }
    if(!validName.test(lName)) {
        errorElem.style.opacity = 1;
        errMsg.innerHTML = "Invalid last name. Letters only.";
        $(this).bind('click', handler);
        return;
    }
    if(!validEmail.test(email)) {
        errorElem.style.opacity = 1;
        errMsg.innerHTML = "Invalid email. Format: test@example.com.";
        $(this).bind('click', handler);
        return;
    }
    if(!validPhone.test(phone)) {
        errorElem.style.opacity = 1;
        errMsg.innerHTML = "Invalid phone number. Exactly 10 digits only.";
        $(this).bind('click', handler);
        return;
    }
    else {
        $(this).unbind('click', handler);
        closeModal();
        clearInput();
    }
}

/**
 * Checks the validity of the email address for the removal input.
 */
function validateEmail(){
    let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    let email = document.getElementById("emailToRemove").value;
    let errorElem = document.getElementById("emailError");
    let errMsg = document.getElementById("emailErrMsg");

    if(!validEmail.test(email)) {
        errorElem.style.opacity = 1;
        errMsg.innerHTML = "Invalid email. Format: test@example.com.";
        $(this).bind('click', handler);
        return;
    }
    else {
        $(this).unbind('click', handler);
        closeModal();
        clearInput();
    }
}

/**
 * Clears input of the modal when it closes. It also removes any error messages from previous input.
 */
function clearInput() {
    if(document.getElementById("emailModal").style.display == "initial") {
        document.getElementById("fName").value = "";
        document.getElementById("lName").value = "";
        document.getElementById("emailToAdd").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("emailToRemove").value = "";
        document.getElementById("emailError").style.opacity = 0;
    }
    else if(document.getElementById("thresholdModal").style.display == "initial"){
        for(let i = 1; i < 6; i++) {
            document.getElementById("stage" + i).value = "";
        }
        document.getElementById("thresholdError").style.opacity = "0";
    }
}

/**
 * 
 * @param {boolean} closing True if the modal is closed via the 'X'
 * Swaps between the displays for entering email addresses and removing them.
 */
function swapEmailForm(closing){
    let save = document.getElementById("saveEmailForm");
    let remove = document.getElementById("removeEmailForm");
    let btn = document.getElementById("swapFormBtn");
    let title = document.getElementById("emailModalTitle");

    document.getElementById("emailError").style.opacity = 0;

    if(closing){
        title.innerHTML = "Receive Notifications";
        save.style.display = "initial";
        remove.style.display = "none";
        btn.innerHTML = "Turn Off Notifications";
        btn.classList.add("btn-warning");
        btn.classList.remove("btn-success");
    }
    else{
        if(save.style.display == "initial" || save.style.display == ""){
            title.innerHTML = "Disable Notifications";
            save.style.display = "none";
            remove.style.display = "initial";
            btn.innerHTML = "Receive Notifications";
            btn.classList.remove("btn-warning");
            btn.classList.add("btn-success");
        }
        else{
            title.innerHTML = "Receive Notifications";
            save.style.display = "initial";
            remove.style.display = "none";
            btn.innerHTML = "Turn Off Notifications";
            btn.classList.add("btn-warning");
            btn.classList.remove("btn-success");
        }
    }
}

/**
 * 
 * @param {boolean} closing True if the modal is closed via the 'X'
 * Swaps between the display for changing thresholds and viewing the current values.
 */
function swapThresholdForm(closing){
    let allInputs = document.getElementById("saveThresholdForm");
    let btn = document.getElementById("viewStagesBtn");
    let title = document.getElementById("thresholdModalTitle");
    let table = document.getElementById("stagesTableDiv");

    document.getElementById("thresholdError").style.opacity = 0;

    if(closing){
        allInputs.style.display = "initial";
        btn.innerHTML = "View Current Stages";
        title.innerHTML = "Set Thresholds";
        table.style.display = "none";
    }
    else{
        if(allInputs.style.display == "initial" || allInputs.style.display == ""){
            title.innerHTML = "View Thresholds";
            allInputs.style.display = "none";
            btn.innerHTML = "Edit Threshold Entries";
            table.style.display = "initial";
        }
        else{
            title.innerHTML = "Set Thresholds";
            allInputs.style.display = "initial";
            btn.innerHTML = "View Current Stages";
            table.style.display = "none";
        }
    }
}