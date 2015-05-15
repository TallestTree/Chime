// From https://github.com/rackt/react-router/blob/master/docs/guides/testing.md
// Stubs Router
var React = require('react');

module.exports = function(Component, props, stubs) {
  var RouterStub = function() { }

  RouterStub.makePath = function() {},
  RouterStub.makeHref = function() {},
  RouterStub.transitionTo = function() {},
  RouterStub.replaceWith = function() {},
  RouterStub.goBack = function() {},
  RouterStub.getCurrentPath = function() {},
  RouterStub.getCurrentRoutes = function() {},
  RouterStub.getCurrentPathname = function() {},
  RouterStub.getCurrentParams = function() {},
  RouterStub.getCurrentQuery = function() {},
  RouterStub.isActive = function() {},
  RouterStub.getRouteAtDepth = function() {},
  RouterStub.setRouteComponentAtDepth = function() {}

  for (var prop in stubs) {
    RouterStub[prop] = stubs[prop];
  }

  return React.createClass({
    childContextTypes: {
      router: React.PropTypes.func,
      routeDepth: React.PropTypes.number
    },

    getChildContext: function() {
      return {
        router: RouterStub,
        routeDepth: 0
      };
    },

    render: function() {
      return <Component {...props} />
    }
  });
};
