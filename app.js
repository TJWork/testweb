var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var app = express();
var count = 0;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var replied = false;
app.get('/*', function (req, res) {
  if (req.params['0'] == 'favicon.ico') {
    res.send("no");
    replied = true;
  }
  else{
  httpGetAsync("http://services.runescape.com/m=itemdb_rs/api/graph/" + req.params['0'] + ".json", function(response){
              //document.documentElement.innerHTML = response;
              console.log(response);
              res.json(response);
              replied = true;
              
  });
    if (! replied)
    res.send("no");
}

  replied = false;
});


function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    ++count;
    xmlHttp.onreadystatechange = function() { 
      console.log("count: " + count + "       " + theUrl);
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }

    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;