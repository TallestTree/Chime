// This is the login page
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// May require a larger container for other details like logo, nav links, etc.

// Main content class that holds everything on the page
var MainContent = React.createClass({
  render: function() {
    return (
      <div>
        <h1>App</h1>
        <SignupButton />
        <RouteHandler />
      </div>
    );
  }
});

// The signup button, which should switch the view to show the signup form
var SignupButton = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    router.transitionTo('/signup');
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="submit" value="Signup" />
      </form>
    );
  }
});

// The signup form class, which displays the form for users to create a new user
var SignupForm = React.createClass({
  render: function() {
    return (
      <form>
        <p>Signup Form</p>
      </form>
    );
  }
});

// Login form class, which contains the input fields and submits those details to the server.
var LoginForm = React.createClass({
  handleSubmit: function(e) {
    // TODO: submit to server
    e.preventDefault();
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit} className="login-form">
        <input type="text" ref="username" />
        <input type="password" ref="password" />
        <input type="submit" value="Log-in" />
      </form>
    );
  }
});

// The routes that the index page will use
var routes = (
  <Route handler={MainContent}>
    <Route path="/" handler={LoginForm} />
    <Route path="/signup" handler={SignupForm} />
  </Route>
);

// Create a router instance to be able to access the history location and transition routes
var router = Router.create({
  routes: routes,
  location: Router.HistoryLocation
});

// Render the Login form on the page
router.run(function(Handler) {
  React.render(<Handler />, document.getElementsByClassName('main-content')[0]);
});
