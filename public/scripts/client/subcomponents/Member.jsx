var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// This is the Member class that renders an individual member and its info
var Member = React.createClass({
  mixins: [Router.Navigation],
  handleClick: function(e) {
    this.setState( {
      id: this.props.data.id,
      first_name: this.props.data.first_name,
      last_name: this.props.data.last_name,
    } );
    this.transitionTo('ping', {id: this.props.data.id});
  },
  render: function() {
    return (
      <div className="col-xs-3 client-contact" onClick={this.handleClick}>
        <img className="client-avatar-photo" src={this.props.data.photo} />
        <div className="row client-avatar-footer">
          <p className="client-avatar-name">{this.props.data.last_name}, {this.props.data.first_name}</p>
          <p className="client-avatar-position">&nbsp;{this.props.data.title}&nbsp;</p>
        </div>
      </div>
    );
  }
});

module.exports = Member;
