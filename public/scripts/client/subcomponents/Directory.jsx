var React = require('react');
var Router = require('react-router');


// Components for Directory
var MemberList = require('./MemberList.jsx');


var Directory = React.createClass({
  componentDidMount: function() {
    // TODO: pass the logged in user's id here, default to 1 for now
    var query = {id: 1};
    // Make a request to the server to retrieve the member data
    $.ajax({
      url: '/api/dashboard',
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
        <h2>{this.state.orgName}</h2>
        <h1>Who are you visiting?</h1>
        <MemberList members={this.state.members} />
      </div>
    );
  }
});

module.exports = Directory;
