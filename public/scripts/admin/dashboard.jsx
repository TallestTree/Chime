// This page contains the React classes to display the dashboard
var React = require('react');
var Member = require('../shared/member.jsx');

// Mock data
var orgInfo = {
  name: 'Makersquare',
  members: [
    {
      first_name: 'Bobby',
      last_name: '1',
      phone: 1234567,
      email: 'example@example.com',
      photo: 'url string',
      title: 'Test dummy'
    },
    {
      first_name: 'Bobby',
      last_name: '2',
      phone: 1234567,
      email: 'example@example.com',
      photo: 'url string',
      title: 'Test dummy'
    }
  ]
};

var Dashboard = React.createClass({
  componentDidMount: function() {
    this.setState({
      orgName: orgInfo.name,
      members: orgInfo.members
    });
  },
  getInitialState: function() {
    return {members: []};
  },
  render: function() {
    return (
      <div>
        <h2>{this.state.orgName}</h2>
        <h3>Dashboard</h3>
        <Directory members={this.state.members} />
      </div>
    );
  }
});

var Directory = React.createClass({
  render: function() {
    var members = this.props.members.map(function(member) {
      return (
        <Member data={member} />
      );
    });
    return (
      <div>
        <h4>Directory</h4>
        {members}
      </div>
    );
  }
});

module.exports = {
  Dashboard: Dashboard
};
