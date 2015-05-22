require('../testdom.js')('<!doctype html><html><body></body></html>');

var chai = require('chai');
var expect = chai.expect;
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var stubRouterContext = require('../stubRouterContext.jsx');
var sinon = require('sinon');

describe('front-end admin pages', function() {
  var instance;
  var mockOrg = {
    name: 'Test Company',
    default_id: 2,
    logo: 'https://i.imgur.com/hs9QmyP.png',
    welcome_message: 'Welcome!'
  };
  var mockMembers = [
    {
      id: 1,
      first_name: 'Test',
      last_name: 'Dummy',
      title: 'Tester'
    },
    {
      id: 2,
      first_name: 'Banana',
      last_name: 'Man',
      title: 'Tester'
    },
    {
      id: 3,
      first_name: 'Dude',
      last_name: 'Bro',
      title: 'Tester'
    }
  ];

  afterEach(function() {
    React.unmountComponentAtNode(document);
  });

  describe('signup form', function() {
    var SignupForm = require('../../../public/scripts/admin/subcomponents/SignupForm.jsx');
    var SignupFormStub = stubRouterContext(SignupForm);

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<SignupFormStub />);
    });

    describe('inputs', function() {
      it('should contain inputs with type \'email\', \'text\' and \'password\'', function() {
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'input');

        var inputsArray = Array.prototype.slice.call(inputs);
        var types = {};
        inputsArray.forEach(function(element) {
          if (!types[element.props.type]) {
            types[element.props.type] = 0;
          }
          types[element.props.type]++;
        });
        expect(types.email).to.equal(1);
        expect(types.text).to.be.at.least(1);
        expect(types.password).to.equal(2);
      });
    });
  });

  describe('login form', function() {
    var LoginForm = require('../../../public/scripts/admin/subcomponents/LoginForm.jsx');
    var LoginFormStub = stubRouterContext(LoginForm);

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<LoginFormStub />);
    });

    describe('inputs', function() {
      it('should contain inputs with type \'email\' and \'password\'', function() {
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'input');
        expect(inputs.length).to.equal(2);

        var inputsArray = Array.prototype.slice.call(inputs);
        var types = [];
        inputsArray.forEach(function(element) {
          types.push(element.props.type);
        });
        expect(types.indexOf('email')).to.not.equal(-1);
        expect(types.indexOf('password')).to.not.equal(-1);
      });
    });
  });

  describe('dashboard', function() {
    var Dashboard = require('../../../public/scripts/admin/dashboard.jsx');
    var DashboardStub = stubRouterContext(Dashboard);
    var RouteHandler = require('react-router').RouteHandler;

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<DashboardStub />);
    });

    it('should contain \'Launch Client\'', function() {
      var buttons = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'button');

      var LaunchClient;
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].props.children === 'Launch Client') {
          LaunchClient = buttons[i];
          break;
        }
      }

      expect(LaunchClient).to.not.equal(undefined);
    });

    it('should contain a RouteHandler for nested children', function() {
      var handler = TestUtils.findRenderedComponentWithType(instance, RouteHandler);
      expect(handler).to.not.equal(undefined);
    });
  });

  describe('directory', function() {
    var Directory = require('../../../public/scripts/admin/subcomponents/Directory.jsx');
    var Member = require('../../../public/scripts/shared/member.jsx');

    var refreshSpy = sinon.spy();
    var DirectoryStub = stubRouterContext(Directory, {
      refreshDashboard: refreshSpy,
      org: {},
      members: mockMembers
    });

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<DirectoryStub />);
    });

    describe('componentDidMount', function() {
      it('should call method refreshDashboard', function() {
        expect(refreshSpy.called).to.equal(true);
      });

      it('should populate the member list', function() {
        var members = TestUtils.scryRenderedComponentsWithType(instance, Member);

        expect(members.length).to.equal(3);
      });
    });
  });

  describe('add org form', function() {
    var AddOrgForm = require('../../../public/scripts/admin/subcomponents/AddOrgForm.jsx');
    var AddOrgFormStub = stubRouterContext(AddOrgForm);

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<AddOrgFormStub />);
    });

    describe('inputs', function() {
      it('should contain inputs with type \'url\' and \'text\'', function() {
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'input');
        var inputsArray = Array.prototype.slice.call(inputs);
        var types = {};
        inputsArray.forEach(function(element) {
          if (!types[element.props.type]) {
            types[element.props.type] = 0;
          }
          types[element.props.type]++;
        });
        expect(types.url).to.equal(1);
        expect(types.text).to.be.at.least(1);
      });
    });
  });

  describe('edit org form', function() {
    var EditOrgForm = require('../../../public/scripts/admin/subcomponents/EditOrgForm.jsx');
    var EditOrgFormStub = stubRouterContext(EditOrgForm, {
      org: mockOrg,
      members: mockMembers
    });

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<EditOrgFormStub />);
    });

    describe('inputs', function() {
      it('should contain inputs with type \'url\' and \'text\'', function() {
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'input');
        var inputsArray = Array.prototype.slice.call(inputs);
        var types = {};
        inputsArray.forEach(function(element) {
          if (!types[element.props.type]) {
            types[element.props.type] = 0;
          }
          types[element.props.type]++;
        });
        expect(types.url).to.equal(1);
        expect(types.text).to.be.at.least(1);
      });
    });

    describe('dropdown', function() {
      it('should populate the dropdown with a default user', function() {
        var dropdown = TestUtils.findRenderedDOMComponentWithClass(instance, 'Dropdown-control');
        var defaultUser = TestUtils.findRenderedDOMComponentWithClass(dropdown, 'placeholder');
        var node = React.findDOMNode(defaultUser);
        expect(node.innerHTML).to.equal('Banana Man');
      });
    });
  });

  describe('delete org confirm', function() {
    var DeleteOrgConfirm = require('../../../public/scripts/admin/subcomponents/DeleteOrgConfirm.jsx');
    var DeleteOrgConfirmStub = stubRouterContext(DeleteOrgConfirm, {
      members: mockMembers
    });

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<DeleteOrgConfirmStub />);
    });

    it('should contain \'Delete\' and \'Cancel\' buttons', function() {
      var buttons = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'button');
      var deleteButton = false;
      var cancelButton = false;
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].props.children === 'Delete') {
          deleteButton = true;
        } else if (buttons[i].props.children === 'Cancel') {
          cancelButton = true;
        }
      }

      expect(deleteButton).to.equal(true);
      expect(cancelButton).to.equal(true);
    });
  });

  describe('add user form', function() {
    var AddForm = require('../../../public/scripts/admin/subcomponents/AddForm.jsx');
    var AddFormStub = stubRouterContext(AddForm);

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<AddFormStub />);
    });

    describe('inputs', function() {
      it('should contain inputs with type \'text\', \'email\', \'tel\', and \'url\'', function() {
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'input');
        var inputsArray = Array.prototype.slice.call(inputs);
        var types = {};
        inputsArray.forEach(function(element) {
          if (!types[element.props.type]) {
            types[element.props.type] = 0;
          }
          types[element.props.type]++;
        });
        expect(types.text).to.be.at.least(3);
        expect(types.email).to.equal(1);
        expect(types.tel).to.equal(1);
        expect(types.url).to.equal(1);
      });
    });
  });

  describe('edit user form', function() {
    var EditForm = require('../../../public/scripts/admin/subcomponents/EditForm.jsx');
    var EditFormStub = stubRouterContext(EditForm, {
      params: {user: 2},
      members: mockMembers
    });

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<EditFormStub />);
    });

    describe('inputs', function() {
      it('should contain inputs with type \'text\', \'email\', \'tel\', and \'url\'', function() {
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'input');
        var inputsArray = Array.prototype.slice.call(inputs);
        var types = {};
        inputsArray.forEach(function(element) {
          if (!types[element.props.type]) {
            types[element.props.type] = 0;
          }
          types[element.props.type]++;
        });
        expect(types.text).to.be.at.least(3);
        expect(types.email).to.equal(1);
        expect(types.tel).to.equal(1);
        expect(types.url).to.equal(1);
      });
      it('should have an input with value \'Banana\'', function() {
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'input');
        var inputsArray = Array.prototype.slice.call(inputs);
        var values = {};
        inputsArray.forEach(function(element) {
          values[React.findDOMNode(element).value] = true;
        });
        expect(values.Banana).to.equal(true);
      });
    });
  });

  describe('delete user confirm', function() {
    var DeleteUserConfirm = require('../../../public/scripts/admin/subcomponents/DeleteUserConfirm.jsx');
    var DeleteUserConfirmStub = stubRouterContext(DeleteUserConfirm, {
      params: {user: 2},
      members: mockMembers
    });

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<DeleteUserConfirmStub />);
    });

    it('should contain \'Delete\' and \'Cancel\' buttons', function() {
      var buttons = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'button');

      var deleteButton = false;
      var cancelButton = false;
      for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].props.children === 'Delete') {
          deleteButton = true;
        } else if (buttons[i].props.children === 'Cancel') {
          cancelButton = true;
        }
      }

      expect(deleteButton).to.equal(true);
      expect(cancelButton).to.equal(true);
    });
  });
});
