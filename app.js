'use strict';

var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressJwt = require('express-jwt');

//var routes = require('./routes/index');
var users = require('./routes/users');
var groups = require('./routes/groups');
var messages = require('./routes/messages');

var app = express();

var connection = process.env.MONGOLAB_URI || 'mongodb://localhost/igotthis';
mongoose.connect(connection);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var secret = process.env.SECRET || 'secret-shhh-12345';
app.use('/auth', expressJwt({secret: secret}));

app.use('/', users);
app.use('/', groups);
app.use('/', messages);

//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});
//
//// error handlers
//
//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function(err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});

module.exports = app;

var port = process.env.PORT || 9000;

//Start server
app.listen(port, function() {
    console.log("Express server listening on port %d in %s mode.", 9000, app.get('env'));
});
