var express = require("express");
var app = express();

app.use(express.static(__dirname));

app.use(express.static('static'));

var server = app.listen(3000, '0.0.0.0', function() {
    console.log('working on', server.address().port);
});
