var nodemailer = require('nodemailer');
var modelService = require('../util/model');
var config = require('../config.json');

//NodeMailer MailOptions object. Effectively represents the email itself.
var mailOptions = {
    from: config.email.address,
    to: '', //Queried from the database
    subject: 'ADAS Alert',
    html: ""
}

//NodeMailer Transporter object. Contains information regarding authentication.
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.email.address,
        pass: config.email.password
    }
});

/**
 *  Queries the database and sends emails to all of the entries discovered.
 * @param {DatabaseConnection} con The MySQL datbase connection where the data is stored.
 * 
 * Needs to stay as "exports.sendEmail" otherwise the change to mailOptions.text is not retained.
 */
exports.sendEmail = function(con){
    con.query("SELECT * FROM employee;", (err, emailResult) => {
        if(err) {
            throw err;
        }
        else if(emailResult.length <= 0) {
            console.log("There are currently no emails to contact.");
        }
        else {
            console.log("Amount of emails to contact: " + emailResult.length);
            con.query(`SELECT discharge, twoValves, threeValves, fourValves 
                FROM weatherData 
                WHERE sourceURL = "api.weather.gov";`, (err, weatherResult) => {
                if(err) {
                    throw err;
                }
                else{
                    modelService.getRefreshRate(con, refreshRate => {
                        mailOptions.html += `<div style="font-family:'Times New Roman'">This message is an ADAS Alert.<br><br>` +
                        `<b>Heavy rain predicted in the next 4 days.*</b><br>` +  
                        `Calculated Discharge: ${weatherResult[0].discharge}m³<br><br>` + 
                        `Flood Prevention Strategies:<br>` + 
                        `  - Open 2 valves for ${weatherResult[0].twoValves} hours<br>` + 
                        `  - Open 3 valves for ${weatherResult[0].threeValves} hours<br>` + 
                        `  - Open 4 valves for ${weatherResult[0].fourValves} hours<br><br>` + 
                        `Check back to website in ${refreshRate} hours for updates.<br><br>` +
                        `*<i>based on data solely from weather.gov</i><br><br>` + 
                        `This email was automatically generated. ` + 
                        `Do not reply as this inbox is unmonitored.</div>`;
                        
                        for(let i = 0; i < emailResult.length; i++){
                            mailOptions.to = emailResult[i].email;
                            transporter.sendMail(mailOptions, (error, info) => {
                                if(error) {
                                    console.log(error);
                                }
                                else {
                                    console.log("Email sent! " + info.response);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

/**
 * Inserts a new email into the database.
 * @param {XMLHttpRequest} req The POST request containing an email to insert into the database.
 * @param {DatabaseConnection} con The MySQL datbase connection where the data is stored.
 */
function insertEmail(req, con){
    con.query(`SELECT email FROM employee WHERE email = 
        "${req.body.email_address}";`, (err, result) => {
        if(err) {
            throw err;
        }
        else if(result.length > 0) {
            console.log("That email address already exists!");
        }
        else{
            const INSERT_QUERY = `INSERT INTO employee 
                (firstName, lastName, email, phoneNum) VALUES 
                ("${req.body.first_name}", "${req.body.last_name}", 
                "${req.body.email_address}", "${req.body.phone_number}");`;
            con.query(INSERT_QUERY, (err) => {
                if(err) throw err;
                else console.log("Email successfully added to Database!");
            });
        }
    });
}

/**
 * Removes an existing email from the database.
 * @param {XMLHttpRequest} req The POST request containing an email to remove from the database.
 * @param {DatabaseConnection} con The MySQL datbase connection where the data is stored.
 */
function removeEmail(req, con){
    let SELECT_QUERY = `SELECT email FROM employee 
        WHERE email = '${req.body.email_address}'`;
    con.query(SELECT_QUERY, (err, result) => {
        if(err) {
            console.log("There was a database issue...");
        }
        else if(result.length <= 0){
            console.log("That email address was not found.");
        }
        else{
            console.log(result);
            const DELETE_QUERY = `DELETE FROM employee 
                WHERE email = '${req.body.email_address}';`;
            con.query(DELETE_QUERY, (err) => {
                if(err) throw err;
                else console.log("Email successfully removed!");
            });
        }
    });
}

module.exports.insertEmail = insertEmail;
module.exports.removeEmail = removeEmail;