// This is the client page which shows the members and lets guests ping members
var React = require('react');
var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var utils = require('../shared/utils.jsx');


// Components for WELCOME
var Welcome = require('./subcomponents/Welcome.jsx');

// Components for DIRECTORY
var Directory = require('./subcomponents/Directory.jsx');
var MemberList = require('./subcomponents/MemberList.jsx');
var Member = require('./subcomponents/Member.jsx');

// Components for PING
var PingForm = require('./subcomponents/PingForm.jsx');
var PingConfirm = require('./subcomponents/PingConfirm.jsx');
var PingDefault = require('./subcomponents/PingDefault.jsx');


// Main content class that holds everything on the page
var App = React.createClass({
  componentDidMount: function() {
    this.fetchCompanyData();
  },
  fetchCompanyData: function() {
    // Make a request to the server to retrieve the member data
    utils.makeRequest({
      url: '/api/orgs/client',
      method: 'GET',
      success: function(resp) {
        resp = JSON.parse(resp);
        var state = {};
        state.org = {
          name: resp.name,
          default_id: resp.default_id,
          logo: resp.logo || '',
          welcome_message: resp.welcome_message || 'Welcome visitors!'
        };
        if (resp.members) {
          state.members = resp.members.sort(function(a, b) {
            if (a.first_name.toUpperCase() < b.first_name.toUpperCase()) {
              return -1;
            } else if (a.first_name.toUpperCase() > b.first_name.toUpperCase()) {
              return 1;
            } else if (a.last_name.toUpperCase() === b.last_name.toUpperCase()) {
              return 0;
            } else {
              return a.last_name.toUpperCase() < b.last_name.toUpperCase() ? -1 : 1;
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
  getInitialState: function() {
    return {org: {}, members: []};
  },
  render: function() {
    return (
      <div>
        <RouteHandler org={this.state.org} members={this.state.members} />
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
    <DefaultRoute handler={Welcome} />
    <Route name="directory" path="/directory" handler={Directory} />
    <Route name="ping" path="/ping/:id" handler={PingForm} />
    <Route name="pingdefault" path="/pingdefault/:id" handler={PingDefault} />
    <Route name="pingconfirm" path="/pingconfirm/:success" handler={PingConfirm} />
  </Route>
);

var router = Router.create({
  routes: routes,
  location: Router.HashLocation
});

// Render the Client view
router.run(function(Handler) {
  React.render(<Handler />, document.getElementsByClassName('chime-main-content')[0]);
});

