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
  componentDidMount: function() {
    // console.log( "(PingForm) componentDidMount - Arrival.");
    // console.log( "1(PingForm) passed in... this.props = ", this.props.params.id );

  },
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
        console.log('(PingForm) Ping sent, transitionTo...');
        this.transitionTo('pingconfirm', {success: 1}); // Ping success!
      }.bind(this),
      error: function(jqXHR, status, error) {
        console.error('(PingForm) Error submitting form to server: ' + error + " , transitionTo...");
        this.transitionTo('pingconfirm', {success: 0}); // Ping fail!
      }.bind(this),
      timeout: 5000
    });

  },
  render: function() {
    return(
      <div className="container">
        <form className="col-sm-8 col-xs-12" onSubmit={this.handleSubmit}>
          <h2>Send a Ping:</h2>
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
