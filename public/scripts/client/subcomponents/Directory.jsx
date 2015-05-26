var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// Components for Directory
var MemberList = require('./MemberList.jsx');

var Directory = React.createClass({
  mixins: [Router.Navigation, Router.State],
  clearTimer: function() {
    if (this.state.timeoutId) {
      window.clearTimeout(this.state.timeoutId);
    }
  },
  componentDidMount: function() {
    var timeoutId = window.setTimeout(function() {
      this.transitionTo('/');
      location.reload(false);
    }.bind(this), 1000 * 60 * 5); // 5 mins to take action, then redirect to welcome screen

    this.setState({timeoutId: timeoutId});
  },
  exitView: function() {
    this.clearTimer();
    this.transitionTo('/');
  },
  getInitialState: function() {
    return {timeoutId: null};
  },
  handleDefaultPingClick: function(e) {
    this.clearTimer();
    var defaultId = this.props.org.default_id || this.props.data.id;
    this.transitionTo('pingdefault', {id: this.props.org.default_id});
  },
  handleMemberClick: function() {
    this.clearTimer();
  },
  render: function() {
    return (
      <div className="main-content container-fluid">
        <div className="row client-app-logo cursorPointer" onClick={this.exitView}>
          <img className="col-xs-4 col-sm-3 col-md-2" src="images/logo_03.png" />
        </div>
        <div className="row text-center client-directory-intro">
          <p className="client-large">Please tap on the person you're here to see.</p>
          <p className="client-large">Not sure? <span className="client-large linkColored cursorPointer" onClick={this.handleDefaultPingClick}><b>Tap here.</b></span></p>
        </div>
        <div className="row text-center">
          <div className="col-xs-10 col-xs-push-1 client-directory cursorPointer" onClick={this.handleMemberClick}>
            <MemberList members={this.props.members} />
          </div>
        </div>
      </div>
    );
  }
});
module.exports = Directory;
