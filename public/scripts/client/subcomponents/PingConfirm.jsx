var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// This is the class that displays a Ping confirmation (or Ping error) momentarily...
// then it redirects to the client home, automatically.
var PingConfirm = React.createClass({
  mixins: [Router.Navigation, Router.State],
  componentDidMount: function() {
    var outerScope = this;
    window.setTimeout((function() {
      outerScope.transitionTo('/client');
    }), 8000);

  },
  render: function() {

    if(this.props.params.success==='1') {
      return(
        <div class="alert alert-danger" role="alert">
          <span class="glyphicon" aria-hidden="true"></span>
          Your ping has been sent!
        </div>
      );
    } else {
      return(
        <div class="alert alert-danger" role="alert">
          <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          <span class="sr-only">Error:</span>
          Please try your ping again, or try pinging another person.
        </div>
      );
    }
  }
});

module.exports = PingConfirm;
