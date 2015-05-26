var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// This is the class that displays a Ping confirmation (or Ping error) momentarily...
// then it redirects to the client home, automatically.
var PingConfirm = React.createClass({
  mixins: [Router.Navigation, Router.State],
  componentDidMount: function() {
    // Redirect to welcome screen, also refresh page if there was an error
    if (this.props.params.success==='1') {
      window.setTimeout(function() {
        this.transitionTo('/');
      }.bind(this), 1000 * 7);
    } else {
      window.setTimeout(function() {
        this.transitionTo('/');
        location.reload(false);
      }.bind(this), 1000 * 7);
    }
  },
  render: function() {

    if (this.props.params.success==='1') {
      return(

        <div className="main-content container-fluid">

          <div className="row client-app-logo cursorPointer" onClick={this.exitView}>
            <img className="col-xs-4 col-sm-3 col-md-2" src="images/logo_03.png" />
          </div>

          <div className="row">

            <div className="col-xs-8 col-xs-push-2 client-ping">

              <p className="client-large text-center">Success!</p>
              <p className="client-medium text-center">Your message has been sent.</p>

            </div>
          </div>

        </div>

      );
    } else {
      return(

        <div className="main-content container-fluid">

          <div className="row client-app-logo">
            <img className="col-xs-4 col-sm-3 col-md-2" src="images/logo_03.png" />
          </div>

          <div className="row">
            <div className="col-xs-8 col-xs-push-2 client-ping">

              <p className="client-large text-center">Sorry!</p>
              <p className="client-medium text-center">Please check the internet connection and try again.</p>

            </div>
          </div>

        </div>

      );
    }
  }
});

module.exports = PingConfirm;
