var express = require('express');
var path = require('path');
var app = express();

var server = app.listen(8080, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log(`Application listening on port ${port}`);
});

//In order for this to work properly, the "node *.js" command must be run from the root of the project directory.
    //This is also assuming the files are locally linked properly. They are linked relative to the public folder's view.
app.use(express.static('public'));



app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/public", "index.html"));
});