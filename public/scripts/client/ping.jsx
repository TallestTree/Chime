// This is the client page which shows the members and lets guests ping members
var React = require('react');
var Router = require('react-router');


var Ping = React.createClass({ 
  componentDidMount: function() {
    console.log("(Ping) componentDidMount! >> ", this.props.query);
  },
  getInitialState: function() {
    return {};
  },
  render: function() {
    return(
      <div className="divClass">
        Welcome to Ping!
      </div>
    );
  }
});

module.exports = {
  Ping: Ping
};
