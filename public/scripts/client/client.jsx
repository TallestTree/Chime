// This is the client page which shows the members and lets guests ping members
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var Navigation = Router.Navigation;

// Components for PING
var PingButton = require('./subcomponents/PingButton.jsx');
var PingForm = require('./subcomponents/PingForm.jsx');

// Components for Directory
var MemberList = require('./subcomponents/MemberList.jsx');
var Member = require('./subcomponents/Member.jsx');
var Directory = require('./subcomponents/Directory.jsx');


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
  <Route handler={App}>
    <Route path="/client" handler={Directory} />
    <Route path="/ping" handler={PingForm} />
  </Route>
);


var router = Router.create({
  routes: routes,
  location: Router.HistoryLocation
});

// Render the Login form on the page
router.run(function(Handler) {
  React.render(<Handler />, document.getElementsByClassName('main-content')[0]);
});

