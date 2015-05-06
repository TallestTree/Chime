// This is the client page which shows the members and lets guests ping members
var React = require('react');

var Directory = React.createClass({
  componentDidMount: function() {
    // Make a request to the server to retrieve the member data
    $.ajax({
      url: '/api/dashboard',
      method: 'GET',
      data: 'orgId',
      success: function(resp) {
        resp = JSON.parse(resp);
        this.setState({
          orgName: resp.name,
          members: resp.members
        });
      }.bind(this),
      error: function(err) {
        console.log(err);
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {members: []};
  },
  render: function() {
    return (
      <div className="container-fluid">
        <h2>{this.state.orgName}</h2>
        <h1>Who are you here to see?</h1>
        <MemberList members={this.state.members} />
      </div>
    );
  }
});

// React class for the member list that will render all of the members
var MemberList = React.createClass({
  render: function() {
    // Generate the divs for each member in the data passed in
    var members = this.props.members.map(function(member) {
      return (
        <Member key={member.id} data={member} />
      );
    });
    return (
      <div className="member-list">
        {members}
      </div>
    );
  }
});

// This is the Member class that renders an individual member and its info
var Member = React.createClass({
  handleClick: function(e) {
    console.log("Hello, " + this.props.data.first_name);
  },
  render: function() {
    return (
      <button type="button" className="btn btn-default btn-xl btn-member" onClick={this.handleClick}>
        <img className="member-photo" src={this.props.data.photo} />
        <div className="member-info">
          <p className="member-name">{this.props.data.first_name} {this.props.data.last_name}</p>
          <p className="member-title">{this.props.data.title}</p>
        </div>
      </button>
    );
  }
});

// Render the page starting from the Directory class
React.render(<Directory />, document.getElementsByClassName('main-content')[0]);
