// This page contains the React classes to display the dashboard
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var Dashboard = React.createClass({
  mixins: [Router.Navigation],
  componentDidMount: function() {
    $.ajax({
      url: '/api/dashboard',
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
            return a.last_name.toUpperCase().charAt(0) > b.last_name.toUpperCase().charAt(0) ?
                   1 : -1;
          });
        }
        this.setState(state);
      }.bind(this),
      error: function(jqXHR, status, error) {
        // On 401 error: Unauthorized, redirect to login page
        if (jqXHR.statusCode === 401) {
          this.transitionTo('/');
        }
      }
    });
  },
  getInitialState: function() {
    return {
      org: {},
      members: []
    };
  },
  render: function() {
    return (
      <div>
        <h2>{this.state.org.name}</h2>
        <h3>Dashboard</h3>
        <Link to="dashboard">Dashboard</Link>
        <Link to="editOrg">Edit Org</Link>
        <Link to="addUser">Add User</Link>
        <a href="/client">Launch Client</a>
        <RouteHandler org={this.state.org} members={this.state.members} />
      </div>
    );
  }
});

module.exports = Dashboard;
