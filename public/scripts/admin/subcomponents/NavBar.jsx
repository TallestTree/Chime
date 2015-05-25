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
        <div className="nav navbar-nav navbar-right dashboard-navbar-button">
          <Link to="login" className="btn btn-navbar dashboard-small">Log In</Link>
        </div>
      );
    }
    if (this.props.page === 'login' || this.props.page === 'landing') {
      signup = (
        <div className="nav navbar-nav navbar-right dashboard-navbar-button">
          <Link to="signup" className="btn btn-navbar dashboard-small">Sign Up</Link>
        </div>
      );
    }
    if (this.props.page === 'dashboard') {
      logout = (
        <div className="nav navbar-nav navbar-right dashboard-navbar-button">
          <button type="button" className="btn btn-navbar dashboard-small" onClick={this.handleLogout}>Log Out</button>
        </div>
      );
    }
    return (
      <nav className="navbar navbar-default dashboard-navbar">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse">
              <span className="sr-only">Toggle Navigation</span>
              <span className="glyphicon glyphicon-option-horizontal" aria-hidden="true"></span>
              <span className="sr-only">Menu Options</span>
            </button>
            <Link to="dashboard"><img className="dashboard-navbar-app-logo" src="images/logo_03.png" /></Link>
          </div>
          <div className="collapse navbar-collapse dashboard-navbar-buttons" id="navbar-collapse">
            {login}
            {signup}
            {logout}
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = NavBar;
