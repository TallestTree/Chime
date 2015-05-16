var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;


// Components for Directory
var MemberList = require('./MemberList.jsx');


var Directory = React.createClass({
  mixins: [Router.Navigation, Router.State],
  getInitialState: function() {
    React.initializeTouchEvents(true); // Required to enable touch event handling.
    return {members: []};
  },
  handleHomeClick: function(e) {
    this.exitView();
    e.preventDefault();
  },
  exitView: function() {
    this.transitionTo('/');
  },
  render: function() {
    return (

      <div className="main-content container-fluid">
        <div className="row client-app-logo" onClick={this.handleHomeClick}>
          <img className="col-sm-2" src="images/logo_03.png" />
        </div>
        <div className="row text-center">
          <div className="col-xs-4 col-xs-push-4">
            <img className="client-org-logo-directory" src="images/mks-02.png" />
          </div>
        </div>
        <div className="row text-center client-directory-intro">
          <p className="client-large">Please tap on the person you're here to see.</p>
          <p className="client-large">Not sure? <a href="#">Tap here.</a></p>
        </div>
        <div className="row text-center">
          <div className="col-xs-10 col-xs-push-1 client-directory">


            <MemberList members={this.props.members} />


          </div>
        </div>
      </div>

    );
  }
});

module.exports = Directory;

