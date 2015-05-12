// This page contains the React classes to display the dashboard
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var Dashboard = React.createClass({
  mixins: [Router.Navigation],
  componentDidMount: function() {
    var query = {id: 1};

    $.ajax({
      url: '/api/orgs/dashboard',
      method: 'GET',
      data: query,
      success: function(data) {
        data = JSON.parse(data);
        var state = {};
        state.orgName = data.name || null;
        state.members = data.members || [];
        this.setState(state);
      }.bind(this),
      error: function(jqXHR, status, error) {
        // On 401 error: Unauthorized, redirect to login page
        console.error('Error retrieving list:', status, error);
      }
    });
  },
  getInitialState: function() {
    return {
      members: []
    };
  },
  render: function() {
    return (
      <div>
        <h2>{this.state.orgName}</h2>
        <h3>Dashboard</h3>
        <Link to="dashboard">Dashboard</Link>
        <Link to="org">Edit Org</Link>
        <Link to="addUser">Add User</Link>
        <a href="/client">Launch Client</a>
        <RouteHandler members={this.state.members} />
      </div>
    );
  }
});

module.exports = Dashboard;
