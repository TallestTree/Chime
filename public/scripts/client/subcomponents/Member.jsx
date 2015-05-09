var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;



// This is the Member class that renders an individual member and its info
var Member = React.createClass({
  mixins: [Router.Navigation],
  handleClick: function(e) {
    console.log("(client.jsx): Hello, " + this.props.data.first_name);
    this.transitionTo('/ping', {id: this.props.data.id});
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

module.exports = Member;
