var React = require('react');
var UserForm = require('./UserForm.jsx');
var Router = require('react-router');

// Renders the form displayed to edit a user
var EditForm = React.createClass({
  propTypes: {
    members: React.PropTypes.array.isRequired
  },
  mixins: [Router.Navigation],
  render: function() {
    var id = +this.props.params.user;
    var member = this.props.members.reduce(function(a,b) {
      return a || (b.id === id ? b : null);
    }, null);

    if (member === null) {
      // TODO: error handling for Member not found in data (likely due to not coming from dash page)
      this.transitionTo('/dashboard');
    }

    return ( <UserForm title="Edit User" url="/update" member={member}/> );
  }
});

module.exports = EditForm;
