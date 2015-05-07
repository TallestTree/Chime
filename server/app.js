var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/client', function(req, res) {
  res.sendFile('client.html', {root: path.join(__dirname, '../public')});
});

app.get('/', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, '../public')});
});

var apiRouter = express.Router();
app.use('/api', apiRouter);
require('./api/apiRoutes.js')(apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});

module.exports = app;
