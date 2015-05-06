var apiController = require('./apiController');

module.exports = function (app) {
  app.route('/dashboard')
    .get(apiController.getDashboardInfo);

  app.route('/client')
    .get(apiController.getClientInfo);

  // app.route('/add')
  //   .post(apiController.postAddMember);

  // app.route('/ping')
  //   .post(apiController.postPing);

  // app.route('/login')
  //    .post(apiController.postLogin);

  // app.route('/signup')
  //    .post(apiController.postSignup);
};
