// This page contains the React classes to display the dashboard
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var utils = require('../shared/utils.jsx');

var Dashboard = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function() {
    return {
      org: {},
      members: []
    };
  },
  handleClient: function(e) {
    e.preventDefault();

    utils.makeRequest({
      url: '/api/client-login',
      method: 'POST',
      success: function(data) {
        window.location.href = '/client';
      }.bind(this),
      error: function(error) {
      }.bind(this)
    });
  },
  refresh: function() {
    // Refresh the member list. This function is called whenever the Directory mounts
    utils.makeRequest({
      url: '/api/orgs/dashboard',
      method: 'GET',
      success: function(data) {
        data = JSON.parse(data);
        var state = {};
        if (data.name) {
          state.org = {
            name: data.name,
            default_id: data.default_id,
            logo: data.logo || null,
            welcome_message: data.welcome_message || null
          };
        } else {
          this.transitionTo('addOrg');
        }
        if (data.members) {
          state.members = data.members.sort(function(a, b) {
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
      error: function(jqXHR, status, error) {
        switch (jqXHR.statusCode) {
          case 401: // Unauthorized, user not logged in
            this.transitionTo('/');
            break;
          default: // Display default error
        }
      }
    });
  },
  render: function() {
    return (
      <div>
        <h2>{this.state.org.name}</h2>
        <button type="button" onClick={this.handleClient}>Launch Client</button>
        <h3>Dashboard</h3>
        <Link to="dashboard">Directory</Link>
        <Link to="editOrg">Edit Org</Link>
        <Link to="addUser">Add User</Link>
        <RouteHandler refreshDashboard={this.refresh} org={this.state.org} members={this.state.members} />
      </div>
    );
  },
  // Redirects if user tries to access page without the correct authorization
  statics: {
    willTransitionTo: function (transition, params, query, callback) {
      utils.makeRequest({
        url: '/api/auth-admin',
        method: 'GET',
        success: function(data) {
          callback();
        }.bind(this),
        error: function(error) {
          if (error === 'Logged in as client') {
            window.location.href = '/client';
          } else {
            window.location.href = '/';
          }
          callback(error);
        }.bind(this)
      });
    }
  }
});

module.exports = Dashboard;
