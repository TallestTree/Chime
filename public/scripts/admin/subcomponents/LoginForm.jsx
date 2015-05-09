var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var formUtils = require('../../shared/formUtils.jsx');

// Login form class, which contains the input fields and submits those details to the server.
var LoginForm = React.createClass({
  mixins: [Router.Navigation],
  handleSubmit: function(e) {
    e.preventDefault();
    // TODO: submit to server
    var props = formUtils.pullRefs(this.refs, FORM_REFS);

    this.transitionTo('/dashboard');
  },
  render: function() {
    return (
      <div className="container">
        <form className="col-sm-8 col-xs-8" onSubmit={this.handleSubmit}>
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

var FORM_REFS = [
  'email',
  'password'
];

module.exports = LoginForm;
