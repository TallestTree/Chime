var React = require('react');
var Router = require('react-router');


// Components for Directory
var MemberList = require('./MemberList.jsx');


var Directory = React.createClass({
  componentDidMount: function() {
    // Make a request to the server to retrieve the member data
    $.ajax({
      url: '/api/orgs/client',
      method: 'GET',
      data: query,
      success: function(resp) {
        resp = JSON.parse(resp);
        this.setState({
          orgName: resp.name,
          members: resp.members
        });
      }.bind(this),
      error: function(error) {
        console.log(error);
      }.bind(this)
    });
  },
  getInitialState: function() {
    React.initializeTouchEvents(true); // Required to enable touch event handling.
    return {members: []};
  },
  render: function() {
    return (
      <div className="container-fluid">
        <h2>Welcome to {this.state.orgName}</h2>
        <h1>Who are you visiting?</h1>
        <MemberList members={this.state.members} />
      </div>
    );
  }
});

module.exports = Directory;
