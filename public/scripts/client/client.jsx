// This is the client page which shows the members and lets guests ping members
var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var utils = require('../shared/utils.jsx');

// Components for PING
var PingForm = require('./subcomponents/PingForm.jsx');
var PingConfirm = require('./subcomponents/PingConfirm.jsx');

// Components for Directory
var MemberList = require('./subcomponents/MemberList.jsx');
var Member = require('./subcomponents/Member.jsx');
var Directory = require('./subcomponents/Directory.jsx');


// Main content class that holds everything on the page
var App = React.createClass({
  getInitialState: function() {
    return {members: []};
  },
  fetchCompanyData: function() {
    // Make a request to the server to retrieve the member data
    utils.makeRequest({
      url: '/api/orgs/client',
      method: 'GET',
      success: function(resp) {
        var state = {};
        resp = JSON.parse(resp);
        if (resp.members) {
          state.members = resp.members.sort(function(a, b) {
            if (a.last_name.toUpperCase() < b.last_name.toUpperCase()) {
              return -1;
            } else if (a.last_name.toUpperCase() > b.last_name.toUpperCase()) {
              return 1;
            } else if (a.first_name.toUpperCase() === b.first_name.toUpperCase()) {
              return 0;
            } else {
              return a.first_name.toUpperCase() < b.first_name.toUpperCase() ? -1 : 1;
            }
          });
        }
        this.setState(state);
      }.bind(this),
      error: function(error) {
        console.log(error);
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.fetchCompanyData();
  },
  render: function() {
    return (
      <div>
        <h1>Chime</h1>
        <RouteHandler members={this.state.members}/>
      </div>
    );
  },
  // Redirects if user tries to access page without the correct authorization
  statics: {
    willTransitionTo: function (transition, params, query, callback) {
      utils.makeRequest({
        url: '/api/auth-client',
        method: 'GET',
        success: function(data) {
          callback();
        }.bind(this),
        error: function(error) {
          if (error === 'Logged in as admin') {
            window.location.href = '/#/dashboard';
          } else {
            window.location.href = '/';
          }
          callback(error);
        }.bind(this)
      });
    }
  }
});


// The routes that the index page will use
var routes = (
  <Route handler={App}>
    <DefaultRoute handler={Directory} />
    <Route name="ping" path="/ping/:id" handler={PingForm} />
    <Route name="pingconfirm" path="/pingconfirm/:success" handler={PingConfirm} />
  </Route>
);


var router = Router.create({
  routes: routes,
  location: Router.HashLocation
});

// Render the Client view
router.run(function(Handler) {
  React.render(<Handler />, document.getElementsByClassName('main-content')[0]);
});

