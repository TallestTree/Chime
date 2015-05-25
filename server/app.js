var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var pg = require('pg');
var pgSession = require('connect-pg-simple')(session);
var config = process.env.NODE_ENV === 'test' ? (process.env.DATABASE_TEST_URL || require('./config/config').testdb.config) : (process.env.DATABASE_URL || require('./config/config').proddb.config);

var app = express();

app.use(favicon(path.join(__dirname, '../public/images/favicon.ico')));
if (process.env.NODE_ENV !== 'test') {
  // Suppress logger while testing to clean up output
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

var secret = process.env.SESSION_SECRET || require('./config/config').session_secret;
app.use(session({
  store: new pgSession({
    pg: pg,
    conString: config,
    ttl: 1000*365*24*60*60, // 1000 years as workaround for never expiring
    pruneSessionInterval: false // Don't automatically remove expired sessions
  }),
  secret: secret,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/client', function(req, res) {
  res.sendFile('client.html', {root: path.join(__dirname, '../public')});
});

app.get('/', function(req, res) {
  res.sendFile('admin.html', {root: path.join(__dirname, '../public')});
});

require('./routers/apiRouter')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// error handler
app.use(function(error, req, res, next) {
  res.status(error.status || 500);
});

module.exports = app;
