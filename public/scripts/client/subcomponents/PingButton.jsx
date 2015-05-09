var React = require('react');
var Router = require('react-router');

// The PingButton button (actually a Post or a Cancel button).
// "Post" submits a Post request, displays a confirmation, then returns to the Directory view.
// "Cancel" transitions back to the Directory view.
var PingButton = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
console.log("(PINGButton) GO!");
    if (this.props.current === 'Cancel') {
      console.log("(PINGButton) Ping dialog cancelled.");
      router.transitionTo('/');
    } else {
      // TODO: submit to server
console.log("(PINGButton) Ping message submitted (To Do).");
      this.props.handleSubmit(e);
      //router.transitionTo('/');
    }
  },
  render: function() {
console.log("(PingButton) render.");
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="submit" value="Send a Ping" />
      </form>
    );
  }
});

module.exports = PingButton;
