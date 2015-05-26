// Example of a test file
require('./testdom.js')('<!doctype html><html><body></body></html'); // Mocks the DOM, see file for details

var chai = require('chai');
var expect = chai.expect;
var React = require('react/addons');
var TestUtils = React.addons.TestUtils; // Provides Test Utilities to use: http://facebook.github.io/react/docs/test-utils.html
var stubRouterContext = require('./stubRouterContext.jsx'); // Stub Router to control context, see file for details

describe('front-end testing set-up', function() {
  var Dashboard;

  before(function() {
    Dashboard = require('../../public/scripts/admin/dashboard.jsx');
  });

  it('should be able to require files', function() {
    expect(Dashboard).to.be.a('function');
  });

  it('should be able to stub the router and render a component', function() {
    var DashboardStub = stubRouterContext(Dashboard);
    expect(DashboardStub).to.be.a('function');

    var dashboard = TestUtils.renderIntoDocument(
      <DashboardStub />
    );

    expect(dashboard).to.be.a('object');
  });
});
