var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var SectionRotatingBg = require('./RotatingBg.jsx');
var NavBar = require('./NavBar.jsx');
var Form = require('../../shared/form.jsx');
var utils = require('../../shared/utils.jsx');

// Login form class, which contains the input fields and submits those details to the server.
var LoginForm = React.createClass({
  mixins: [Router.Navigation],
  handleSubmit: function(e) {
    e.preventDefault();

    var props = utils.pullRefs(this.refs, FORM_REFS);

    // Causes required fields to be highlighted
    if (props === false) {
      return;
    }

    // TODO: Display logging in status message
    utils.makeRequest({
      url: '/api/login',
      method: 'POST',
      data: props,
      success: function(data) {
        this.transitionTo('/dashboard');
        location.reload(false);
      }.bind(this),
      error: function(error) {
        alert(error);
      }
    });
  },
  render: function() {
    return (
      <SectionRotatingBg>
        <NavBar page="login" />
        <div className="col-xs-6 col-xs-push-3 dashboard-content">
          <div className="row text-center dashboard-large">LOG IN</div>
          <Form.Form onSubmit={this.handleSubmit}>
            <Form.Input label="Email" type="email" ref="email" />
            <Form.Input label="Password" type="password" ref="password" />
            <div className="col-xs-4 col-xs-push-4">
              <button type="submit" className="btn btn-default dashboard-medium dashboard-button-medium">Log in</button>
            </div>
          </Form.Form>
        </div>
      </SectionRotatingBg>
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
