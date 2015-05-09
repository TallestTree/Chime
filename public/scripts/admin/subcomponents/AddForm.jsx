var React = require('react');
var Router = require('react-router');
var formUtils = require('../../shared/formUtils.jsx');

// The form displayed to Add Users
var AddForm = React.createClass({
  mixins: [Router.Navigation, Router.State],
  componentDidMount: function() {
    if (this.isActive('edit')) {
      var memberNum = this.props.params.user;
      console.log(this.props.members[memberNum]);
      // After looking up the user data, can populate the fields in the form
    }
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var member = formUtils.pullRefs(this.refs, FORM_REFS);
    console.log(member);
    $.ajax({
      url: '/api/add',
      method: 'POST',
      data: member,
      success: function(data) {
        console.log('User added');
        // TODO: Add confirmation of user add
        this.transitionTo('dashboard');
      }.bind(this),
      error: function(jqXHR, status, error) {
        console.error('Error submitting form to server:', error);
        this.transitionTo('dashboard');
      }.bind(this),
      timeout: 5000
    });
  },
  render: function() {
    return (
      <div className="container">
        <form className="col-sm-8 col-xs-12" onSubmit={this.handleSubmit}>
          <h3>Add User</h3>
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
          <button type="submit" className="btn btn-default">Add User</button>
        </form>
      </div>
    );
  }
});

var FORM_REFS = [
  'first_name',
  'last_name',
  'title',
  'email',
  'phone'
];

module.exports = AddForm;
