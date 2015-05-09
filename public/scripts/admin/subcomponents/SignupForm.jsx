var React = require('react');
var Router = require('react-router');
var formUtils = require('../../shared/formUtils.jsx');

// The signup form class, which displays the form for users to create a new user
var SignupForm = React.createClass({
  mixins: [Router.Navigation],
  handleSubmit: function(e) {
    var props = formUtils.pullRefs(this.refs, FORM_REFS);

    if (props.password !== props.repeatPassword) {
      console.log('Passwords must match');
      return;
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
            <label>Email</label>
            <input type="email" className="form-control" ref="email" />
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

var FORM_REFS = [
  'email',
  'password',
  'repeatPassword'
];

module.exports = SignupForm;
