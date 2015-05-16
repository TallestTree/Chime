var express = require('express');
var apiController = require('../controllers/apiController');
var orgsController = require('../controllers/orgsController');
var usersController = require('../controllers/usersController');
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
    .post(loggedInAdmin, usersController.postAddMember);
  usersRouter.route('/update')
    .post(loggedInAdmin, usersController.postUpdateMember);
  usersRouter.route('/delete')
    .post(loggedInAdmin, usersController.postDeleteMember);
  usersRouter.route('/ping')
    .post(loggedInClient, usersController.postPing);

  orgsRouter.route('/add')
    .post(loggedInAdmin, orgsController.postAddOrg);
  orgsRouter.route('/update')
    .post(loggedInAdmin, orgsController.postUpdateOrg);
  orgsRouter.route('/delete')
    .post(loggedInAdmin, orgsController.postDeleteOrg);
  orgsRouter.route('/dashboard')
    .get(loggedInAdmin, orgsController.getDashboardInfo);
  orgsRouter.route('/client')
    .get(loggedInClient, orgsController.getClientInfo);
};
