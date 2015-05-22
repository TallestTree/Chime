var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var NavBar = require('./NavBar.jsx');
var Form = require('../../shared/form.jsx');
var utils = require('../../shared/utils.jsx');

// Login form class, which contains the input fields and submits those details to the server.
var LoginForm = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function() {
    return {error: null};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.setState({error: null});

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
      error: function(error, status) {
        this.setState({error: error});
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <NavBar page="login" />
        <div className="col-xs-6 col-xs-push-3 dashboard-content">
          <div className="row text-center dashboard-large">LOG IN</div>
          <Form.Form error={this.state.error} onSubmit={this.handleSubmit}>
            <Form.Input label="Email:" type="email" ref="email" />
            <Form.Input label="Password:" type="password" ref="password" />
            <div className="col-xs-6 col-xs-push-3 col-md-8 col-md-push-2">
              <button type="submit" className="btn btn-default dashboard-medium dashboard-button-medium">Submit</button>
            </div>
          </Form.Form>
        </div>
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
