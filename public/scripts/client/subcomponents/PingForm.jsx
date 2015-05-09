var React = require('react');
var Router = require('react-router');

var PingButton = require('./PingButton.jsx');

var PingForm = React.createClass({ 
  handleSubmit: function(e) {
  console.log("(PING) handleSubmit -- e = ", e);
  e.preventDefault();
  //   router.transitionTo('/'); ???
  },
  componentDidMount: function() {
    console.log("(Ping) componentDidMount! >> ", this.props.query);
  },
  getInitialState: function() {
    return {};
  },
  render: function() {
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <h2>Ping a member:</h2>
          <label>Your name <input type="text" ref="visitorName" /></label>
          <label>Message&nbsp;(optional) <input type="text" ref="visitorMessage" /></label>
          <PingButton current="Send a Ping" />
        </form>
      </div>
    );
  }
});

module.exports = PingForm;
