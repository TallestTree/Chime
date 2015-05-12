var apiController = require('./apiController');
// var loggedIn = require('../auth/authUtils').loggedIn;
// var isLoggedIn = require('../auth/authUtils').isLoggedIn;

module.exports = function(app) {
  app.route('/dashboard')
    .get(apiController.getDashboardInfo);

  app.route('/client')
    .get(apiController.getClientInfo);

  app.route('/add')
    .post(apiController.postAddMember);

  app.route('/update')
    .post(apiController.postUpdateMember);

  app.route('/ping')
    .post(apiController.postPing);

  app.route('/signup')
     .post(apiController.postSignup);

  app.route('/login')
     .post(apiController.postLogin);
};
