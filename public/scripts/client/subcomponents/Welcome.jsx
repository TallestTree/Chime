var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// First client-facing page
var Welcome = React.createClass({
  mixins: [Router.Navigation, Router.State],
  getInitialState: function() {
    React.initializeTouchEvents(true); // Required to enable touch event handling.
    return {};
  },
  handleClick: function(e) {
    this.transitionTo('directory');
  },
  render: function() {
    return (
      <div onClick={this.handleClick}>
        <div className="main-content container-fluid">

          <div className="row client-app-logo">
            <img className="col-xs-4 col-sm-3 col-md-2" src="images/logo_03.png" />
          </div>

          <div className="row text-center">
            <div className="col-xs-4 col-xs-push-4">
              <img className="client-org-logo-welcome" src={this.props.org.logo} />
            </div>
          </div>

          <div className="row text-center client-welcome">
            <p className="client-huge">{this.props.org.welcome_message}</p>
            <p className="client-large">Please tap the screen and let us know you're here.</p>
          </div>

        </div>
      </div>

    );
  }
});

module.exports = Welcome;
