var React = require('react');

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var SectionRotatingBg = require('./RotatingBg.jsx');

var LoginContainer = React.createClass({
  render: function() {
    return (
      <SectionRotatingBg>
        <RouteHandler />
      </SectionRotatingBg>
    );
  }
});

module.exports = LoginContainer;
