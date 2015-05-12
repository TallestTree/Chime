var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Navigation = Router.Navigation;

// Components for Login page
var LoginForm = require('./subcomponents/LoginForm.jsx');
var SignupForm = require('./subcomponents/SignupForm.jsx');

// Components for the dashboard
var Dashboard = require('./dashboard.jsx');
var Directory = require('./subcomponents/Directory.jsx');
var AddForm = require('./subcomponents/AddForm.jsx');
var EditForm = require('./subcomponents/EditForm.jsx');

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

// The routes that the index page will use
var routes = (
  <Route ignoreScrollBehavior handler={App}>
    <Route path="/" handler={LoginForm} />
    <Route name="signup" path="/signup" handler={SignupForm} />
    <Route name="dashboard" handler={Dashboard}>
      <DefaultRoute handler={Directory} />
      <Route name="add" handler={AddForm} />
      <Route name="edit" path="edit/:user" handler={EditForm} />
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
