// This is the client page which shows the members and lets guests ping members
var React = require('react');

// Mock data for a member list
var orgInfo = {
  name: 'Makersquare',
  members: [
    {
      id: 1,
      first_name: 'Bobby',
      last_name: 'Hill',
      photo: 'http://i.imgur.com/KQjdi0i.jpg',
      title: 'Student'
    },
    {
      id: 2,
      first_name: 'Hank',
      last_name: 'Hill',
      photo: 'http://i.imgur.com/sY47Zl6.jpg',
      title: 'Propane Salesman'
    },
    {
      id: 3,
      first_name: 'Luanne',
      last_name: 'Platter',
      photo: 'http://i.imgur.com/hUoJph9.jpg',
      title: 'Beautician'
    },
    {
      id: 4,
      first_name: 'Dale',
      last_name: 'Gribble',
      photo: 'http://i.imgur.com/FJw1Nbb.jpg',
      title: 'Exterminator'
    },
    {
      id: 5,
      first_name: 'Peggy',
      last_name: 'Hill',
      photo: 'http://i.imgur.com/gnzS7G5.jpg',
      title: 'Homemaker'
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
