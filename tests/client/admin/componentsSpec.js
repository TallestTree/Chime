require('../testdom.js')('<!doctype html><html><body></body></html');

var chai = require('chai');
var expect = chai.expect;
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var stubRouterContext = require('../stubRouterContext.jsx');
var sinon = require('sinon');

describe('front-end admin pages', function() {
  var instance;

  afterEach(function() {
    React.unmountComponentAtNode(document);
  });

  describe('dashboard', function() {
    var Dashboard = require('../../../public/scripts/admin/dashboard.jsx');
    var DashboardStub = stubRouterContext(Dashboard);

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<DashboardStub />);
    });

    it('should contain \'dashboard\' header', function() {
      var heading = TestUtils.findRenderedDOMComponentWithTag(instance, 'h3');
      expect(React.findDOMNode(heading).innerHTML).to.equal('Dashboard');
    });

    describe('links', function() {
      it('should contain links named Directory, Edit Org, and Add User', function() {
        var links = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'a');
        var linksArray = Array.prototype.slice.call(links);

        expect(links.length).to.equal(3);

        var names = [];
        linksArray.forEach(function(element) {
          var node = React.findDOMNode(element);
          names.push(node.innerHTML);
        });

        expect(names.indexOf('Directory')).to.not.equal(-1);
        expect(names.indexOf('Edit Org')).to.not.equal(-1);
        expect(names.indexOf('Add User')).to.not.equal(-1);
      });
    });
  });

  describe('directory', function() {
    var Directory = require('../../../public/scripts/admin/subcomponents/Directory.jsx');

    var refreshSpy = sinon.spy();
    var DirectoryStub = stubRouterContext(Directory, {
      refreshDashboard: refreshSpy,
      org: {},
      members: [
        {
          id: 1,
          first_name: 'Test',
          last_name: 'Dummy',
          title: 'Tester',
        },
        {
          id: 2,
          first_name: 'Banana',
          last_name: 'Man',
          title: 'Tester'
        }
      ]
    });

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<DirectoryStub />);
    });

    it('should call method refreshDashboard', function() {
      expect(refreshSpy.called).to.be.ok;
    });

    it('should populate the member list', function() {
      var members = TestUtils.findRenderedDOMComponentWithClass(instance, 'member-list').getDOMNode();

      expect(members.children.length).to.equal(2);
    });
  });
});
