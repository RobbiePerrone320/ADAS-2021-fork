var nodemailer = require('nodemailer');

var mailOptions = {
    from: 'cappingtest@gmail.com',
    to: '', //Queried from the database
    subject: 'ADAS Alert',
    text: `This message is an ADAS Alert.\n
            Heavy rain is predicted in the next four (4) days.\n`
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cappingtest@gmail.com',
        pass: 'Rhineback2019'
    }
});

/**
 * @param {DatabaseConnection} con The MySQL datbase connection where the data is stored
 * Queries the database and sends emails to all of the emails discovered
 */
exports.sendEmail = function(con){
    con.query("SELECT discharge, twoValves, threeValves, fourValves FROM weatherData;", function(err, result){
        if(err) throw err;
        else{
            mailOptions.text += `This message is an ADAS Alert.\n\n` +
            `Heavy rain predicted in the next 4 days.\n` +  
            `Calculated Discharge: ${result[0].discharge}m³\n\n` + 
            `Flood Prevent Strategies:\n` + 
            `   - Open 2 valves for ${result[0].twoValves} hours\n` + 
            `   - Open 3 valves for ${result[0].threeValves} hours\n` + 
            `   - Open 4 valves for ${result[0].fourValves} hours\n\n` + 
            `Check back to website in xx hours for updates.\n\n` +
            `This email was automatically generated. Do not reply as this inbox is unmonitored.`;
        }
    });
    var selectQuery = "SELECT * FROM employee;";
    con.query(selectQuery, function(err, result){
        if(err) throw err;
        console.log("Result: " + result);
        for(let i = 0; i < result.length; i++){
            mailOptions.to = result[i].email;
            transporter.sendMail(mailOptions, function(error, info){
                if(error) console.log(error);
                else console.log("Email sent! " + info.response);
            });
        }
    });
}

/**
 * @param {XMLHttpRequest} req The POST request containing an email to insert into the database
 * @param {DatabaseConnection} con The MySQL datbase connection where the data is stored
 * Inserts a new email into the database
 */
exports.insertEmail = function(req, con){
    let insertQuery = `INSERT INTO employee (firstName, lastName, email, phoneNum) VALUES 
    ("${req.body.first_name}", "${req.body.last_name}", "${req.body.email_address}", "${req.body.phone_number}");`;
    con.query(insertQuery, function(err){
        if(err) throw err;
        else console.log("Data successfully input!");
    });
}

/**
 * @param {XMLHttpRequest} req The POST request containing an email to remove from the database
 * @param {DatabaseConnection} con The MySQL datbase connection where the data is stored
 * Removes an existing email from the database
 */
exports.removeEmail = function(req, con){
    let selectQuery = `SELECT email FROM employee WHERE email = '${req.body.email_address}'`;
    con.query(selectQuery, function(err, result){
        if(err) console.log("There was an issue...");
        else if(result.length <= 0){
            console.log("That email address was not found.");
        }
        else{
            console.log(result);
            let deleteQuery = `DELETE FROM employee WHERE email = '${req.body.email_address}';`;
            con.query(deleteQuery, function(err){
                if(err) throw err;
                else console.log("Email successfully removed!");
            });
        }
    });
}