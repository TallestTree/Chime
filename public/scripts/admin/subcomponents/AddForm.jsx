var React = require('react');
var UserForm = require('./UserForm.jsx');

// Renders the form displayed to add user
var AddForm = React.createClass({
  render: function() {
    return ( <UserForm title="ADD USER" url="/add" /> );
  }
});

module.exports = AddForm;
