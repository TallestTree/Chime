var React = require('react');
var Router = require('react-router');

var NavBar = require('./NavBar.jsx');
var utils = require('../../shared/utils.jsx');
var Form = require('../../shared/form.jsx');

// The signup form class, which displays the form for users to create a new user
var SignupForm = React.createClass({
  mixins: [Router.Navigation],
  handleSubmit: function(e) {
    e.preventDefault();

    var props = utils.pullRefs(this.refs, FORM_REFS);

    // Causes required fields to be highlighted
    if (props === false) {
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
        this.transitionTo('addOrg');
        location.reload(false);
      }.bind(this),
      error: function(error) {
        alert(error);
      }
    });
  },
  render: function() {
    return (
      <div>
        <NavBar page="signup" />
        <div className="col-xs-6 col-xs-push-3 dashboard-content">
          <div className="row text-center dashboard-large">SIGN UP</div>
          <Form.Form onSubmit={this.handleSubmit}>
            <Form.Input label="Email" type="email" ref="email" />
            <Form.Input label="First Name" type="text" ref="first_name" />
            <Form.Input label="Last Name" type="text" ref="last_name" />
            <Form.Input label="Password" type="password" ref="password" />
            <Form.Input label="Confirm Password" type="password" ref="repeatPassword" />
            <div className="col-xs-6 col-xs-push-3 col-md-8 col-md-push-2">
              <button type="submit" className="btn btn-default dashboard-medium dashboard-button-medium">Sign Up</button>
            </div>
          </Form.Form>
        </div>
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
