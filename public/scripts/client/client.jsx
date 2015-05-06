// This is the client page which shows the members and lets guests ping members
var React = require('react');

// Mock data for a member list
var orgInfo = {
  name: 'Makersquare',
  members: [
    {
      first_name: 'Bobby',
      last_name: '1',
      phone: 1234567,
      email: 'example@example.com',
      photo: 'url string',
      title: 'Test dummy'
    },
    {
      first_name: 'Bobby',
      last_name: '2',
      phone: 1234567,
      email: 'example@example.com',
      photo: 'url string',
      title: 'Test dummy'
    }
  ]
};

var Directory = React.createClass({
  componentDidMount: function() {
    // Make a request to the server to retrieve the member data
    $.ajax({
      url: '/',
      method: 'GET',
      data: 'username',
      success: function(data) {
        this.setState({
          orgName: orgInfo.name,
          members: orgInfo.members
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
      <div>
        <h2>{this.state.orgName}</h2>
        <h1>Who do you want to see?</h1>
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
        <Member data={member} />
      );
    });

    return (
      <div>
        {members}
      </div>
    );
  }
});

// This is the Member class that renders an individual member and its info
var Member = React.createClass({
  handleClick: function(e) {
    console.log(this);
  },
  render: function() {
    return (
      <div onClick={this.handleClick} className="member">
        <div className="memberName">{this.props.data.first_name} {this.props.data.last_name}</div>
        <div className="memberTitle">{this.props.data.title}</div>
      </div>
    )
  }
});

// Render the page starting from the Directory class
React.render(<Directory />, document.getElementsByClassName('main-content')[0]);
