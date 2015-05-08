// This page contains the React classes to display the dashboard
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Navigation = Router.Navigation;
var Link = Router.Link;

var AddForm = require('./subcomponents/AddForm.jsx');

var Dashboard = React.createClass({
  componentDidMount: function() {
    $.ajax({
      url: '/api/dashboard',
      method: 'GET',
      success: function(data) {
        console.log('Dashboard - new member data retrieved', data.members);
        data = JSON.parse(data);
        var state = {};
        state.orgName = data.name || null;
        state.members = data.members || [];
        this.setState(state);
      }.bind(this),
      error: function(jqXHR, status, error) {
        console.error('Dashboard req error:', status, error, jqXHR);
      }
    });
  },
  getInitialState: function() {
    return {
      view: 'directory',
      members: []
    };
  },
  render: function() {
    return (
      <div>
        <h2>{this.state.orgName}</h2>
        <h3>Dashboard</h3>
        <Link to="/dashboard/add">Add User</Link>
        <a href="/client">Launch Client</a>
        <RouteHandler members={this.state.members} />
      </div>
    );
  }
});

module.exports = Dashboard;