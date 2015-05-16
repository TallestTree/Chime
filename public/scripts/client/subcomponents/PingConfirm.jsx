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
      outerScope.transitionTo('directory');
    }), 5000);

  },
  render: function() {

    if(this.props.params.success==='1') {
      return(

        <div className="main-content container-fluid">
          <div className="row client-app-logo">
            <img className="col-xs-4 col-sm-3 col-md-2" src="images/logo_03.png" />
          </div>
          <div className="row">
            <div className="col-xs-8 col-xs-push-2 client-ping">

                <h2>Your ping message has been sent!</h2>

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

              <h2>ERROR - Please try your ping again, or ping another person.</h2>

            </div>
          </div>
        </div>

      );
    }
  }
});

module.exports = PingConfirm;
