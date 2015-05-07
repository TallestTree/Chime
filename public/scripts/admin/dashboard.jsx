// This page contains the React classes to display the dashboard
var React = require('react');
var Member = require('../shared/member.jsx');
var Navigation = require('react-router').Navigation;
var Link = require('react-router').Link;

// Mock data
var orgInfo = {
  name: 'Makersquare',
  members: [
    {
      id: 1,
      first_name: 'Bobby',
      last_name: 'Hill',
      photo: 'http://i.imgur.com/KQjdi0i.jpg',
      title: 'Student'
    },
    {
      id: 2,
      first_name: 'Hank',
      last_name: 'Hill',
      photo: 'http://i.imgur.com/sY47Zl6.jpg',
      title: 'Propane Salesman'
    },
    {
      id: 3,
      first_name: 'Luanne',
      last_name: 'Platter',
      photo: 'http://i.imgur.com/hUoJph9.jpg',
      title: 'Beautician'
    },
    {
      id: 4,
      first_name: 'Dale',
      last_name: 'Gribble',
      photo: 'http://i.imgur.com/FJw1Nbb.jpg',
      title: 'Exterminator'
    },
    {
      id: 5,
      first_name: 'Peggy',
      last_name: 'Hill',
      photo: 'http://i.imgur.com/gnzS7G5.jpg',
      title: 'Homemaker'
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
        <Link to="add">Add User</Link>
        <a href="/client">Launch Client</a>
        <Directory members={this.state.members} />
        {this.state.view === 'add' ? <AddForm /> : ''}
      </div>
    );
  }
});

var Directory = React.createClass({
  mixins: [Navigation],
  memberClick: function(self) {
    console.log('hello,', self.props.data.first_name);
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

var AddForm = React.createClass({
  mixins: [Navigation],
  handleSubmit: function(e) {
    e.preventDefault();
    var member = {
      first_name: this.refs.firstName.getDOMNode().value.trim(),
      last_name: this.refs.lastName.getDOMNode().value.trim(),
      email: this.refs.email.getDOMNode().value.trim(),
      phone: this.refs.phone.getDOMNode().value.trim()
    };
    this.transitionTo('dashboard');
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Add User</h3>
        <label>First Name<input type="text" ref="firstName" /></label>
        <label>Last Name<input type="text" ref="lastName" /></label>
        <label>Title<input type="text" ref="title" /></label>
        <label>Email Address<input type="text" ref="email" /></label>
        <label>Phone Number<input type="text" ref="phone" /></label>
        <input type="submit" value="Add User" />
      </form>
    );
  }
});

module.exports = {
  Dashboard: Dashboard,
  AddForm: AddForm
};
