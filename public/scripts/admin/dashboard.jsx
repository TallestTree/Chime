// This page contains the React classes to display the dashboard
var React = require('react');
var Member = require('../shared/member.jsx');
var Navigation = require('react-router').Navigation;
var Link = require('react-router').Link;

var Dashboard = React.createClass({
  componentDidMount: function() {
    $.ajax({
      url: '/api/dashboard',
      method: 'GET',
      success: function(data) {
        data = JSON.parse(data);
        var state = {};

        this.setState({
          orgName: data.name,
          members: data.members || []
        });
      }.bind(this),
      error: function(jqXHR, status, error) {
        console.error('Dashboard req error:', jqXHR, status, error);
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
        <Link to="add">Add User</Link>
        <a href="/client">Launch Client</a>
        <Directory members={this.state.members} />
      </div>
    );
  }
});

var Directory = React.createClass({
  mixins: [Navigation],
  memberClick: function(self) {
    console.log('redirect to edit for ', self.props.data.first_name);
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
    $.ajax({
      url: '/api/add',
      method: 'POST',
      data: member,
      succss: function(data) {
        console.log('User added');
        // TODO: Add confirmation of user add
        this.transitionTo('dashboard');
      }.bind(this),
      error: function(jqXHR, status, error) {
        console.error(status, error);
        this.transitionTo('dashboard');
      }.bind(this),
      timeout: 2000
    });
    // this.transitionTo('dashboard');
  },
  render: function() {
    return (
      <div className="container">
        <form className="col-xs-8" onSubmit={this.handleSubmit}>
          <h3>Add User</h3>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" className="form-control" ref="firstName" />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" className="form-control" ref="lastName" />
          </div>
          <div className="form-group">
            <label>Title</label>
            <input type="text" className="form-control" ref="title" />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" ref="email" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" className="form-control" ref="phone" />
          </div>
          <button type="submit" className="btn btn-default">Add User</button>
        </form>
      </div>
    );
  }
});

module.exports = {
  Dashboard: Dashboard,
  AddForm: AddForm
};
