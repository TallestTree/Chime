var React = require('react');
var Router = require('react-router');
var utils = require('../../shared/utils.jsx');

// The form displayed to Add Users
var AddForm = React.createClass({
  mixins: [Router.Navigation, Router.State],
  componentDidMount: function() {
    if (this.state.member) {
      React.findDOMNode(this.refs.first_name).value = this.state.member.first_name;
      React.findDOMNode(this.refs.last_name).value = this.state.member.last_name;
      React.findDOMNode(this.refs.title).value = this.state.member.title;
      React.findDOMNode(this.refs.email).value = this.state.member.email;
      React.findDOMNode(this.refs.phone).value = this.state.member.phone;
    }
  },
  getInitialState: function() {
    var state = {};
    if (this.isActive('edit')) {
      // Validate that this came from the dashboard
      var memberNum = parseInt(this.props.params.user, 10);
      state.display = 'Edit User';
      state.member = this.props.members.reduce(function(a,b) {
        return a || (b.id === memberNum ? b : null);
      }, null);
      if (state.member === null) {
        // TODO: error handling for Member not found in data (likely due to not coming from dash page)
        this.transitionTo('/dashboard');
      }
    } else {
      state.display = 'Add User';
    }
    return state;
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var member = utils.pullRefs(this.refs, FORM_REFS);
    if (member.phone) {
      member.phone = utils.parsePhone(member.phone);
      if (member.phone === false) {
        //TODO: Display error for phone number format (must have 10 numbers)
        return;
      }
    }

    var urlString = '/api/';

    if (this.state.display === 'Add User') {
      urlString += 'add';
    } else {
      urlString += 'edit'; // TODO: Update url string with correct path to update a user
    }

    $.ajax({
      url: urlString,
      method: 'POST', 
      data: member,
      success: function(data) {
        // TODO: Add confirmation of user add
        this.transitionTo('dashboard');
      }.bind(this),
      error: function(jqXHR, status, error) {
        // TODO: Add error display to user (Redirect to error page?)
        console.error('Error submitting form to server:', error);
        this.transitionTo('dashboard');
      }.bind(this),
      timeout: 5000
    });
  },
  render: function() {
    return (
      <div className="container">
        <form className="col-sm-8 col-sm-offset-2 col-xs-12" onSubmit={this.handleSubmit}>
          <h3>{this.state.display} Form</h3>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" className="form-control" ref="first_name" />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" className="form-control" ref="last_name" />
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
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
      </div>
    );
  }
});

var FORM_REFS = {
  required: [],
  optional: [
    'first_name',
    'last_name',
    'title',
    'email',
    'phone'
  ]
};

module.exports = AddForm;
