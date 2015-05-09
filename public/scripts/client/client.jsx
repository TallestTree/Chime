// This is the client page which shows the members and lets guests ping members
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// var classNames = require('classnames');

// Main content class that holds everything on the page
var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1>Chime</h1>
        <RouteHandler />
      </div>
    );
  }
});

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
    console.log("(client.jsx): Hello, " + this.props.data.first_name);
    router.transitionTo('/ping', {first_name: this.props.data.first_name});
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


var Ping = React.createClass({
  handleSubmit: function(e) {
  console.log("(PING) handleSubmit -- e = ", e);
  e.preventDefault();
  //   router.transitionTo('/'); ???
  },
  componentDidMount: function() {
    console.log("(Ping) componentDidMount! >> ", this.props.query);
  },
  getInitialState: function() {
    return {};
  },
  render: function() {
    return(
      <div>
        <form onSubmit={this.handleSubmit} className="pingForm">
          <h2>Ping a member:</h2>
          <label>Your name <input type="text" ref="visitorName" /></label>
          <label>Message&nbsp;(optional) <input type="text" ref="visitorMessage" /></label>
          <PingButton current="Send a Ping" />
        </form>
      </div>
    );
  }
});

// The PingButton button (actually a Post or a Cancel button).
// "Post" submits a Post request, displays a confirmation, then returns to the Directory view.
// "Cancel" transitions back to the Directory view.
var PingButton = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
console.log("(PINGButton) GO!");
    if (this.props.current === 'Cancel') {
      console.log("(PINGButton) Ping dialog cancelled.");
      router.transitionTo('/');
    } else {
      // TODO: submit to server
      console.log("(PINGButton) Ping message submitted (To Do).");
      this.props.handleSubmit(e);
      //router.transitionTo('/');
    }
  },
  render: function() {
console.log("(PingButton) render.");
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="submit" value="Send a Ping" />
      </form>
    );
  }
});

// The routes that the index page will use
var routes = (
  <Route handler={App}>
    <Route path="/" handler={Directory} />
    <Route path="/client" handler={Directory} />
    <Route path="/ping" handler={Ping} />
  </Route>
);


var router = Router.create({
  routes: routes,
  location: Router.HistoryLocation
});

// Render the Login form on the page
router.run(function(Handler) {
  React.render(<Handler />, document.getElementsByClassName('main-content')[0]);
});

