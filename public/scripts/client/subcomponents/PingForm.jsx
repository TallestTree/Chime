var React = require('react');
var Router = require('react-router');

// ToDo:  Incorporate <div dangerouslySetInnerHTML={{__html="<p>foo</p>"}} />

// Components for PingForm
var Member = require('./Member.jsx');
var MemberList = require('./MemberList.jsx');


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

    // TODO:  Reenable later, so we don't send a bunch of actual test pings to Matt.
    $.ajax({
      url: '/api/ping',
      method: 'POST',
      data: messageObj,
      succss: function(data) {
        console.log('(PingForm) Ping sent.');
        // TODO: Add ping confirmation message
        this.transitionTo('/client'); // TODO:  Call after alert is display for 7 seconds.
      }.bind(this),
      error: function(jqXHR, status, error) {
        console.error('(PingForm) Error submitting form to server:', error);
        // TODO: Add ping Not Sent message
        this.transitionTo('/client'); // TODO:  Call after alert is display for 7 seconds.
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
