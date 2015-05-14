var React = require('react');
var Router = require('react-router');


// Components for Directory
var MemberList = require('./MemberList.jsx');


var Directory = React.createClass({
  getInitialState: function() {
    React.initializeTouchEvents(true); // Required to enable touch event handling.
    return {members: []};
  },
  render: function() {
    return (
      <div className="container-fluid">
        <h2>Welcome to {this.props.orgName}</h2>
        <h1>Who are you visiting?</h1>
        <MemberList members={this.props.members} />
      </div>
    );
  }
});

module.exports = Directory;

