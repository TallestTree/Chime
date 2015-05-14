var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

// ToDo:  Incorporate <div dangerouslySetInnerHTML={{__html="<p>foo</p>"}} />

// Components for PingForm
var Member = require('./Member.jsx');  // TODO:  Remove these two later. PLB
var MemberList = require('./MemberList.jsx');
var PingConfirm = require('./PingConfirm.jsx');


var PingForm = React.createClass({
  mixins: [Router.Navigation, Router.State],
  getInitialState: function() {
    return {visitorName: '', visitorMessage: '', member: ''};
  },
  handleSubmit: function(e) {
    var messageObj = {
      id: this.props.params.id,
      visitor: React.findDOMNode(this.refs.visitorName).value,
      text: React.findDOMNode(this.refs.visitorMessage).value,
    };
    e.preventDefault();

    $.ajax({
      url: '/api/users/ping',
      method: 'POST',
      data: messageObj,
      success: function(data) {
        this.transitionTo('pingconfirm', {success: 1}); // Ping success!
      }.bind(this),
      error: function(jqXHR, status, error) {
        console.error('(PingForm) Error submitting form to server: ' + error );
        this.transitionTo('pingconfirm', {success: 0}); // Ping fail!
      }.bind(this),
      timeout: 5000
    });

  },
  render: function() {
    return(
      <div className="container">
        <h2>Send Ping to {this.props.members[this.props.params.id - 1].first_name} {this.props.members[this.props.params.id - 1].last_name}:</h2>

        <div className="btn btn-default btn-xl btn-member">
          <img className="member-photo" src={this.props.members[this.props.params.id - 1].photo} />
          <div className="member-info">
            <p className="member-name">{this.props.members[this.props.params.id - 1].first_name} {this.props.members[this.props.params.id - 1].last_name}</p>
            <p className="member-title">{this.props.members[this.props.params.id - 1].title}</p>
          </div>
        </div>

        <form className="col-sm-8 col-xs-12" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label className="visitor-name">Your name</label>
            <input type="text" className="form-control" ref="visitorName" />
          </div>
          <div className="form-group">
            <label className="visitor-message">Message&nbsp;(optional)</label>
            <input type="text" className="form-control" ref="visitorMessage" />
          </div>
          <button type="submit" className="btn btn-default">Send Ping</button>
        </form>
      </div>
    );
  }
});

module.exports = PingForm;

