var apiController = require('./apiController');
var loggedIn = require('../auth/authUtils').loggedIn;
var isLoggedIn = require('../auth/authUtils').isLoggedIn;

module.exports = function(app) {
  app.route('/dashboard')
    .get(loggedIn, apiController.getDashboardInfo);

  app.route('/client')
    .get(loggedIn, apiController.getClientInfo);

  app.route('/add')
    .post(loggedIn, apiController.postAddMember);

  app.route('/update')
    .post(apiController.postUpdateMember);

  app.route('/ping')
    .post(loggedIn, apiController.postPing);

  app.route('/signup')
     .post(apiController.postSignup);

  app.route('/login')
     .post(apiController.postLogin);
};
