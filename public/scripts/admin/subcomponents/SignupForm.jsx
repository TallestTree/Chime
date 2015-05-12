var React = require('react');
var Router = require('react-router');
var utils = require('../../shared/utils.jsx');
var Form = require('../../shared/form.jsx');

// The signup form class, which displays the form for users to create a new user
var SignupForm = React.createClass({
  mixins: [Router.Navigation],
  handleSubmit: function(e) {
    e.preventDefault();

    var props = utils.pullRefs(this.refs, FORM_REFS);

    if (props === false) {
      //TODO: Display error for missing fields
      alert('Missing fields');
      return;
    }
    
    if (props.password !== $(React.findDOMNode(this.refs.repeatPassword)).find('input').val()) {
      // TODO: Display error for matching passwords
      alert('Passwords must match');
      return;
    }
    
    utils.makeRequest({
      url: '/api/signup',
      method: 'POST',
      data: props,
      success: function(data) {
        this.transitionTo('/dashboard');
      }.bind(this),
      error: function(error) {
        alert(error);
      }
    });
  },
  render: function() {
    return (
      <div className="container">
        <Form.Form onSubmit={this.handleSubmit}>
          <h2>Sign up</h2>
          <Form.Input label="Email" type="email" ref="email" />
          <Form.Input label="First Name" type="text" ref="first_name" />
          <Form.Input label="Last Name" type="text" ref="last_name" />
          <Form.Input label="Password" type="password" ref="password" />
          <Form.Input label="Confirm Password" type="password" ref="repeatPassword" />
          <button type="submit" className="btn btn-default">Sign Up</button>
        </Form.Form>
      </div>
    );
  }
});

var FORM_REFS ={
  required: [
    'first_name',
    'last_name',
    'email',
    'password'
  ],
  optional: []
};

module.exports = SignupForm;
