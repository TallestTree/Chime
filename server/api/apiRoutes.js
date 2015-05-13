var apiController = require('./apiController');
var loggedInAdmin = require('../auth/authUtils').loggedInAdmin;
var loggedInClient = require('../auth/authUtils').loggedInClient;

module.exports = function(app) {
  app.route('/dashboard')
    .get(loggedInAdmin, apiController.getDashboardInfo);

  app.route('/add')
    .post(loggedInAdmin, apiController.postAddMember);

  app.route('/update')
    .post(loggedInAdmin, apiController.postUpdateMember);

  app.route('/client-login')
     .post(loggedInAdmin, apiController.postClientLogin);

  app.route('/client')
    .get(apiController.getClientInfo); // TODO: add loggedInClient middleware

  app.route('/ping')
    .post(apiController.postPing); // TODO: add loggedInClient middleware

  app.route('/signup')
     .post(apiController.postSignup);

  app.route('/login')
     .post(apiController.postLogin);
};
