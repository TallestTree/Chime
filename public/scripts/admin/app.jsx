// This is the login page
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Navigation = Router.Navigation;

// Components for the dashboard
var Dashboard = require('./dashboard.jsx').Dashboard;
var AddForm = require('./subcomponents/AddForm.jsx');

// Main content class that holds everything on the page
var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Chime</h1>
        <RouteHandler />
      </div>
    );
  }
});

// Login form class, which contains the input fields and submits those details to the server.
var LoginForm = React.createClass({
  mixins: [Navigation],
  handleSubmit: function(e) {
    e.preventDefault();
    // TODO: submit to server
    this.transitionTo('/dashboard');
  },
  render: function() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="login-form">
          <h2>Log in</h2>
          <label>Username<input type="text" ref="username" /></label>
          <label>Password<input type="password" ref="password" /></label>
          <input type="submit" value="Log-in" />
        </form>
        <SignupButton current="login" />
      </div>
    );
  }
});

// The signup form class, which displays the form for users to create a new user
var SignupForm = React.createClass({
  mixins: [Navigation],
  handleSubmit: function(e) {
    console.log(
      this.refs.username.getDOMNode().value.trim(),
      this.refs.password.getDOMNode().value,
      this.refs.repeatPassword.getDOMNode().value
    );
    // TODO: Send request to server to validate
    this.transitionTo('/dashboard');
  },
  render: function() {
    return (
      <div>
        <form>
          <h2>Sign up</h2>
          <label>Username<input type="text" ref="username" /></label>
          <label>Password<input type="password" ref="password" /></label>
          <label>Repeat password<input type="password" ref="repeatPassword" /></label>
        </form>
        <SignupButton handleSubmit={this.handleSubmit} current="signup" />
      </div>
    );
  }
});

// The signup button, which should switch the view to show the signup form
var SignupButton = React.createClass({
  mixins: [Navigation],
  handleSubmit: function(e) {
    e.preventDefault();

    if (this.props.current === 'login') {
      this.transitionTo('/signup');
    } else {
      // TODO: submit to server
      this.props.handleSubmit(e);
    }
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="submit" value="Signup" />
      </form>
    );
  }
});

// The routes that the index page will use
var routes = (
  <Route handler={App}>
    <Route path="/" handler={LoginForm} />
    <Route name="signup" handler={SignupForm} />
    <Route name="dashboard" handler={Dashboard}>
      <Route name="add" handler={AddForm} />
    </Route>
  </Route>
);

// Create a router instance to be able to access the history location and transition routes
var router = Router.create({
  routes: routes,
  location: Router.HashLocation
});

// Render the Login form on the page
router.run(function(Handler) {
  React.render(<Handler />, document.getElementsByClassName('main-content')[0]);
});
