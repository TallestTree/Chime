var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var utils = require('../../shared/utils.jsx');

var NavBar = React.createClass({
  propTypes: {
    page: React.PropTypes.string
  },
  mixins: [Router.Navigation],
  handleLogout: function(e) {
    e.preventDefault();

    utils.makeRequest({
      url: '/api/logout',
      method: 'POST',
      success: function(data) {
        this.transitionTo('/login');
        location.reload(false);
      }.bind(this),
      error: function(error) {
      }.bind(this)
    });
  },
  render: function() {
    var login;
    var signup;
    var logout;
    if (this.props.page === 'signup' || this.props.page === 'landing') {
      login = (
        <div className="nav navbar-nav navbar-right col-xs-1 col-xs-pull-1">
          <Link to="login" className="btn btn-navbar dashboard-small dashboard-navbar-button">Log In</Link>
        </div>
      );
    }
    if (this.props.page === 'login' || this.props.page === 'landing') {
      signup = (
        <div className="nav navbar-nav navbar-right col-xs-1 col-xs-pull-1">
          <Link to="signup" className="btn btn-navbar dashboard-small dashboard-navbar-button">Sign Up</Link>
        </div>
      );
    }
    if (this.props.page === 'dashboard') {
      logout = (
        <div className="nav navbar-nav navbar-right col-xs-1 col-xs-pull-1">
          <button type="button" className="btn btn-navbar dashboard-small dashboard-navbar-button" onClick={this.handleLogout}>Log Out</button>
        </div>
      );
    }
    return (
      <nav className="navbar navbar-default dashboard-navbar">
        <div className="container-fluid">
          <div className="col-xs-1 col-xs-push-1 navbar-header">
            <Link to="dashboard"><img className="dashboard-navbar-app-logo" src="images/logo_03.png" /></Link>
          </div>
          {login}
          {signup}
          {logout}
        </div>
      </nav>
    );
  }
});

module.exports = NavBar;
