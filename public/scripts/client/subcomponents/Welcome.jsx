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
    console.log("WELCOME CLICK!");
    this.transitionTo('directory');
  },
  render: function() {
    return (

      <div className="container">

        <div className="main-content container-fluid" onClick={this.handleClick}>

          <div className="row client-app-logo">
            <img className="col-sm-2" src="images/logo_03.png" />
          </div>

          <div className="row text-center">
            <div className="col-xs-4 col-xs-push-4">
              <img className="client-org-logo-welcome" src="images/mks-02.png" />
            </div>
          </div>

          <div className="row text-center client-welcome">
            <p className="client-huge">Welcome visitors!</p>
            <p className="client-large">Please tap the screen to let us know you're here.</p>
          </div>

        </div>

      </div>

    );
  }
});

module.exports = Welcome;
