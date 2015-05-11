var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var utils = require('../../shared/utils.jsx');

// Login form class, which contains the input fields and submits those details to the server.
var LoginForm = React.createClass({
  mixins: [Router.Navigation],
  handleSubmit: function(e) {
    e.preventDefault();

    var props = utils.pullRefs(this.refs, FORM_REFS);

    if (props === false) {
      // TODO: Display error
      console.error('Missing fields');
      return;
    }

    console.log('Attempting to log in'); // TODO: Display logging in status message
    utils.makeRequest({
      url: '/api/login',
      method: 'POST',
      data: props, 
      success: function(data) {
        this.transitionTo('/dashboard');
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="container">
        <form className="col-sm-8 col-sm-offset-2 col-xs-12" onSubmit={this.handleSubmit}>
          <h2>Log in</h2>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" ref="email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" ref="password" />
          </div>
          <button type="submit" className="btn btn-default">Log in</button>
          <Link to="signup" className="btn btn-default">Sign up</Link>
        </form>
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
