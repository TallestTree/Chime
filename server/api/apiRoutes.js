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
  apiRouter.route('/auth-admin')
     .get(loggedInAdmin, apiController.getAuth);
  apiRouter.route('/auth-client')
     .get(loggedInClient, apiController.getAuth);

  usersRouter.route('/add')
    .post(loggedInAdmin, apiController.postAddMember);
  usersRouter.route('/update')
    .post(loggedInAdmin, apiController.postUpdateMember);
  usersRouter.route('/ping')
    .post(loggedInClient, apiController.postPing);

  orgsRouter.route('/add')
    .post(loggedInAdmin, apiController.postAddOrg);
  orgsRouter.route('/update')
    .post(loggedInAdmin, apiController.postUpdateOrg);
  orgsRouter.route('/dashboard')
    .get(loggedInAdmin, apiController.getDashboardInfo);
  orgsRouter.route('/client')
    .get(loggedInClient, apiController.getClientInfo);
};
