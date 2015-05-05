// This is the login page

// May require a larger container for other details like logo, nav links, etc.

// Main content class that holds everything on the page
var React = require('react');

var MainContent = React.createClass({
  componentWillMount: function() {
    this.setState({page: 'login'})
  },
  switchToSignup: function() {
    this.setState({page: 'signup'});
  },
  render: function() {
    if (this.state.page === 'login') {
      var form = ( <LoginForm /> );
    } else {
      form = ( <SignupForm /> );
    }
    return (
      <div>
        <h1>App</h1>
        <SignupButton onButtonSubmit={this.switchToSignup} />
        {form}
      </div>
    );
  }
});

// The signup button, which should switch the view to show the signup form
var SignupButton = React.createClass({
  handleSubmit: function() {
    this.props.onButtonSubmit();

    return false;
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="submit" value="Signup" />
      </form>
    );
  }
});

// The signup form class, which displays the form for users to create a new user
var SignupForm = React.createClass({
  render: function() {
    return (
      <form>
        <p>Signup Form</p>
      </form>
    );
  }
})

// Login form class, which contains the input fields and submits those details to the server.
var LoginForm = React.createClass({
  handleSubmit: function() {
    // TODO: submit to server
    return false;
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit} className="login-form">
        <input type="text" ref="username" />
        <input type="password" ref="password" />
        <input type="submit" value="Log-in" />
      </form>
    );
  }
});

// Render the Login form on the page
React.render(<MainContent />, document.getElementsByClassName('main-content')[0]);
