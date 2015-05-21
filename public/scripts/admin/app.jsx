var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Navigation = Router.Navigation;
var Redirect = Router.Redirect;

// Components for Login page
var LoginForm = require('./subcomponents/LoginForm.jsx');
var SignupForm = require('./subcomponents/SignupForm.jsx');

// Components for the dashboard
var Dashboard = require('./dashboard.jsx');
var Directory = require('./subcomponents/Directory.jsx');
var AddForm = require('./subcomponents/AddForm.jsx');
var EditForm = require('./subcomponents/EditForm.jsx');
var AddOrgForm = require('./subcomponents/AddOrgForm.jsx');
var EditOrgForm = require('./subcomponents/EditOrgForm.jsx');
var SectionRotatingBg = require('./subcomponents/RotatingBg.jsx');

// Main content class that holds everything on the page
var App = React.createClass({
  render: function() {
    return (
      <div className="main-content container-fluid">
        <SectionRotatingBg>
          <RouteHandler />
        </SectionRotatingBg>
      </div>
    );
  }
});

// The routes that the index page will use
var routes = (
  <Route ignoreScrollBehavior handler={App}>
    <Redirect from="/" to="login" />
    <Route name="login" path="/login" handler={LoginForm} />
    <Route name="signup" path="/signup" handler={SignupForm} />
    <Route name="dashboard" handler={Dashboard}>
      <DefaultRoute handler={Directory} />
      <Route name="addUser" path="add" handler={AddForm} />
      <Route name="editUser" path="edit/:user" handler={EditForm} />
      <Route name="editOrg" path="organization" handler={EditOrgForm} />
    </Route>
    <Route name="addOrg" handler={AddOrgForm} />
  </Route>
);

// Create a router instance to be able to access the history location and transition routes
var router = Router.create({
  routes: routes,
  location: Router.HashLocation
});

// Render the Login form on the page
router.run(function(Handler) {
  React.render(<Handler />, document.body);
});
