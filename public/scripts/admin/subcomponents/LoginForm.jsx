var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Form = require('../../shared/form.jsx');
var utils = require('../../shared/utils.jsx');

// Login form class, which contains the input fields and submits those details to the server.
var LoginForm = React.createClass({
  mixins: [Router.Navigation],
  handleSubmit: function(e) {
    e.preventDefault();

    var props = utils.pullRefs(this.refs, FORM_REFS);

    // TODO: Display logging in status message
    utils.makeRequest({
      url: '/api/login',
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
          <h2>Log in</h2>
          <Form.Input label="Email" type="email" ref="email" />
          <Form.Input label="Password" type="password" ref="password" />
          <button type="submit" className="btn btn-default">Log in</button>
          <Link to="signup" className="btn btn-default">Sign up</Link>
        </Form.Form>
      </div>
    );
  }
});

var FORM_REFS = {
  required: [
    'email',
    'password'
  ],
  optional: []
};

module.exports = LoginForm;
