var express = require('express');
var apiController = require('./apiController');
var loggedInAdmin = require('../auth/authUtils').loggedInAdmin;
var loggedInClient = require('../auth/authUtils').loggedInClient;

module.exports = function(app) {
  var apiRouter = express.Router();
  var usersRouter = express.Router();
  var orgsRouter = express.Router();

  app.use('/api', apiRouter);
  apiRouter.use('/users', usersRouter);
  apiRouter.use('/orgs', orgsRouter);

  apiRouter.route('/signup')
     .post(apiController.postSignup);
  apiRouter.route('/login')
     .post(apiController.postLogin);
  apiRouter.route('/client-login')
     .post(loggedInAdmin, apiController.postClientLogin);
  apiRouter.route('/logout')
     .post(apiController.postLogout);

  usersRouter.route('/add')
    .post(loggedInAdmin, apiController.postAddMember);
  usersRouter.route('/update')
    .post(loggedInAdmin, apiController.postUpdateMember);
  usersRouter.route('/ping')
    .post(apiController.postPing); // TODO: add loggedInClient middleware

  orgsRouter.route('/dashboard')
    .get(loggedInAdmin, apiController.getDashboardInfo);
  orgsRouter.route('/client')
    .get(apiController.getClientInfo); // TODO: add loggedInClient middleware
};
