var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// Components for PingDefault
var Member = require('./Member.jsx');  // TODO:  Remove these two later. PLB
var MemberList = require('./MemberList.jsx');
var PingConfirm = require('./PingConfirm.jsx');

// Defaults
var defaultGreetingString = "Hello! I'm waiting for you in the reception area.";

var PingDefault = React.createClass({
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
    }.bind(this), 1000 * 60 * 2); // 2 mins to compose and send message, then redirect to welcome screen

    this.setState({timeoutId: timeoutId});
  },
  exitView: function() {
    this.clearTimer();
    this.transitionTo('directory');
  },
  focus: function() {
    if(defaultGreetingString === React.findDOMNode(this.refs.visitorMessage).value) {
      React.findDOMNode(this.refs.visitorMessage).value = '';
    }
  },
  getInitialState: function() {
    return {visitorName: '', visitorMessage: ''};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.clearTimer();

    var messageObj = {
      id: this.props.params.id,
      visitor: React.findDOMNode(this.refs.visitorName).value,
      text: React.findDOMNode(this.refs.visitorMessage).value.slice(0, 160),
    };

    $.ajax({
      url: '/api/users/ping',
      method: 'POST',
      data: messageObj,
      success: function(data) {
        this.transitionTo('pingconfirm', {success: 1}); // Ping success!
      }.bind(this),
      error: function(jqXHR, status, error) {
        console.error('(PingDefault) Error submitting form to server: ' + error );
        this.transitionTo('pingconfirm', {success: 0}); // Ping fail!
      }.bind(this),
      timeout: 10000
    });
  },
  render: function() {
    var targetId = +this.props.params.id;
    var member = this.props.members.reduce(function(a,b) {
      return (a && a.id ? a : null) || (b.id === targetId ? b : null); // Return last selection || return this selection if found...  continue reducing.
    }, null);
    if (member === null) {
      // MemberIndex not found, so return to Directory.
      this.exitView();
    }
    return(

      <div className="main-content container-fluid">

        <div className="row client-app-logo cursorPointer" onClick={this.exitView}>
          <img className="col-xs-4 col-sm-3 col-md-2" src="images/logo_03.png" />
        </div>

        <div className="row">

          <div className="col-xs-8 col-xs-push-2 client-ping">

            <p className="client-large text-center">{member.first_name} {member.last_name}</p>
            <p className="client-medium text-center">&nbsp;{member.first_name} can assist you with general office inquiries.</p>

            <div className="row">
              <div className="col-xs-8 col-xs-push-2 col-md-4 col-md-push-4 text-center">
                <img className="client-ping-avatar" src={member.photo} />
              </div>
            </div>

            <form className="client-ping-form col-xs-8 col-xs-push-2" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label className="client-medium">Your name</label>
                <input type="text" className="form-control client-small client-input" ref="visitorName" />
              </div>
              <div className="form-group">
                <label className="text-left client-medium">Message</label>
                <input type="text" className="form-control client-small client-input" onFocus={this.focus} ref="visitorMessage" defaultValue={defaultGreetingString} />
              </div>
              <div className="row">
                <div className="col-xs-6">
                  <button type="submit" className="btn btn-default client-button client-medium pull-right">Send</button>
                </div>
                <div className="col-xs-6">
                  <button type="button" className="btn btn-default client-button client-medium pull-left" onClick={this.exitView}>Cancel</button>
                </div>
              </div>
            </form>

          </div>

        </div>

      </div>

    );
  }
});

module.exports = PingDefault;

