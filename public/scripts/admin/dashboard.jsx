// This page contains the React classes to display the dashboard
var React = require('react');
var Member = require('../shared/member.jsx');

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
        <Directory members={this.state.members} />
        <RouteHandler />
      </div>
    );
  }
});

var Directory = React.createClass({
  mixins: [Navigation],
  memberClick: function(self) {
    console.log('redirect to edit for', self.props.data.first_name);
    // transition to member profile/edit member page
  },
  render: function() {
    var members = this.props.members.map(function(member) {
      return (
        <Member key={member.id} data={member} memberClick={this.memberClick} />
      );
    }.bind(this));
    return (
      <div>
        <h4>Directory</h4>
        <div className="member-list">
        {members}
        </div>
      </div>
    );
  }
});

module.exports = {
  Dashboard: Dashboard
};
