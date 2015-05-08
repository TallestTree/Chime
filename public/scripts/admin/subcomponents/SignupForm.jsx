var React = require('react');
var Router = require('react-router');

// The signup form class, which displays the form for users to create a new user
var SignupForm = React.createClass({
  mixins: [Router.Navigation],
  handleSubmit: function(e) {
    var username = this.refs.username.getDOMNode().value.trim();
    var pw1 = this.refs.password.getDOMNode().value;
    var pw2 = this.refs.repeatPassword.getDOMNode().value;
    if (pw1 !== pw2) {
      console.log('Passwords must match');
    }
    // TODO: Send request to server to validate
    this.transitionTo('/dashboard');
  },
  render: function() {
    return (
      <div className="container">
        <form className="col-sm-8 col-xs-12" onSubmit={this.handleSubmit}>
          <h2>Sign up</h2>
          <div className="form-group">
            <label>Username</label>
            <input type="text" className="form-control" ref="username" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" ref="password" />
          </div>
          <div className="form-group">
            <label>Repeat password</label>
            <input type="password" className="form-control" ref="repeatPassword" />
          </div>
          <input type="submit" className="btn btn-default" value="Sign up" />
        </form>
      </div>
    );
  }
});

module.exports = SignupForm;
