var React = require('react');
var Router = require('react-router');
var utils = require('../../shared/utils.jsx');

// The signup form class, which displays the form for users to create a new user
var SignupForm = React.createClass({
  mixins: [Router.Navigation],
  handleSubmit: function(e) {
    e.preventDefault();

    var props = utils.pullRefs(this.refs, FORM_REFS);

    if (props === false) {
      //TODO: Display error for missing fields
      console.error('Missing fields');
      return;
    }

    if (props.password !== React.findDOMNode(this.refs.repeatPassword).value) {
      // TODO: Display error for matching passwords
      console.error('Passwords must match');
      return;
    }
    
    utils.makeRequest({
      url: '/api/signup',
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
          <h2>Sign up</h2>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" className="form-control" ref="first_name" />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" className="form-control" ref="last_name" />
          </div>
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
