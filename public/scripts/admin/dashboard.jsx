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
        <h3>Dashboard</h3>
        <Link to="dashboard">Directory</Link>
        <Link to="editOrg">Edit Org</Link>
        <Link to="addUser">Add User</Link>
        <a href="/client">Launch Client</a>
        <RouteHandler refreshDashboard={this.refresh} org={this.state.org} members={this.state.members} />
      </div>
    );
  }
});

module.exports = Dashboard;
