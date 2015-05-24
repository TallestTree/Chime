var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// Components for Directory
var MemberList = require('./MemberList.jsx');

var Directory = React.createClass({
  mixins: [Router.Navigation, Router.State],
  handleHomeClick: function(e) {
    this.clearTimer();
    this.exitView();
    e.preventDefault();
  },
  restartTimer: function() {
    var outerScope = this;
    this.timeoutId = window.setTimeout((function() {
      this.timeoutId = null;
      outerScope.transitionTo('/');
    }), 300 * 1000); // 5 mins to complete the process (300 seconds).  Else it returns to Welcome page.
  },
  clearTimer: function() {
    console.log("clear timeoutId = " + this.timeoutId);
    window.clearTimeout(this.timeoutId);
  },
  exitView: function() {
    this.transitionTo('/');
  },
  handleDefaultPingClick: function(e) {
    this.clearTimer();
    var defaultId = this.props.org.default_id || this.props.data.id;
    this.transitionTo('pingdefault', {id: this.props.org.default_id});
  },
  render: function() {
    this.restartTimer();
    return (

      <div className="main-content container-fluid">
        <div className="row client-app-logo cursorPointer" onClick={this.handleHomeClick}>
          <img className="col-xs-4 col-sm-3 col-md-2" src="images/logo_03.png" />
        </div>
        <div className="row text-center client-directory-intro">
          <p className="client-large">Please tap on the person you're here to see.</p>
          <p className="client-large">Not sure? <span className="client-large linkColored cursorPointer" onClick={this.handleDefaultPingClick}><b>Tap here.</b></span></p>
        </div>
        <div className="row text-center">
          <div className="col-xs-10 col-xs-push-1 client-directory cursorPointer">
            <MemberList members={this.props.members} />
          </div>
        </div>
      </div>

    );
  }
});

module.exports = Directory;

