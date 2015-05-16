var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// First client-facing page
var Welcome = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function() {
    React.initializeTouchEvents(true); // Required to enable touch event handling.
    return {};
  },
  handleClick: function(e) {
    this.transitionTo('directory');
  },
  render: function() {
    return (

      <div className="col-xs-3 client-contact" onClick={this.handleClick}>
        <div>WELCOME TO THE PEOPLES!</div>
        CLICK FOR DIRECTORY
      </div>

    );
  }
});

module.exports = Welcome;
