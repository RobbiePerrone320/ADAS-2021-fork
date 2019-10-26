var mysql = require('mysql');
var nodemailer = require('nodemailer');
var mailOptions = {
    from: 'cappingtest@gmail.com',
    to: '', //Richard.Feldman@marist.edu
    subject: 'Asher Dam Water Level Notification',
    text: ''
}



var con = mysql.createConnection({
    database: 'rhinebeck',
    host: 'localhost',
    user: 'root',
    password: 'rhinebeck2019'
});

con.connect(function(err){
    if(err) throw err;
    else console.log("Connected!");
});

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cappingtest@gmail.com',
        pass: 'Rhineback2019'
    }
});




exports.sendEmail = function(){
    var selectQuery = "SELECT * FROM employee;";
    con.query(selectQuery, function(err, result){
        if(err) throw err;
        console.log("Result: " + result);
        for(let i = 0; i < result.length; i++){
            mailOptions.to = result[i].email;
            mailOptions.text = `Dear ${result[i].firstName},
                You are receiving this email because a certain threshold requirement was met.`;
            transporter.sendMail(mailOptions, function(error, info){
                if(error) console.log(error);
                else console.log("Email sent! " + info.response);
            });
        }
    });
}

exports.insertEmail = function(req) {
    response = {
        first_name: req.query.first_name,
        last_name: req.query.last_name,
        phone_number: req.query.phone_number,
        email_address: req.query.email_address
    };
    console.log(response);

    let insertQuery = `INSERT INTO employee (firstName, lastName, email, phoneNum) VALUES 
    ("${req.query.first_name}", "${req.query.last_name}", "${req.query.email_address}", "${req.query.phone_number}");`;
    con.query(insertQuery, function(err){
        if(err) throw err;
        else console.log("Data successfully input!");
    });
}