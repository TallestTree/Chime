require('../testdom.js')('<!doctype html><html><body></body></html>');

var chai = require('chai');
var expect = chai.expect;
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var stubRouterContext = require('../stubRouterContext.jsx');
var sinon = require('sinon');

describe('front-end client pages', function() {
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

  describe('welcome', function() {
    var Welcome = require('../../../public/scripts/client/subcomponents/Welcome.jsx');
    var WelcomeStub = stubRouterContext(Welcome, {
      org: mockOrg,
      members: mockMembers
    });
    var RouteHandler = require('react-router').RouteHandler;

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<WelcomeStub />);
    });

    it('should contain two images', function() {
      var images = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'img');

      expect(images.length).to.equal(2);
    });
  });

  describe('directory', function() {
    var Directory = require('../../../public/scripts/client/subcomponents/Directory.jsx');
    var Member = require('../../../public/scripts/client/subcomponents/Member.jsx');

    var restartTimerSpy = sinon.spy();
    var DirectoryStub = stubRouterContext(Directory, {
      org: mockOrg,
      members: mockMembers
    });

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<DirectoryStub />);
    });

    describe('render', function() {
      it('should populate the member list', function() {
        var members = TestUtils.scryRenderedComponentsWithType(instance, Member);

        expect(members.length).to.equal(3);
      });
    });
  });

  describe('ping form', function() {
    var PingForm = require('../../../public/scripts/client/subcomponents/PingForm.jsx');
    var PingFormStub = stubRouterContext(PingForm, {
      params: {id: 2},
      org: mockOrg,
      members: mockMembers
    });

    beforeEach(function() {
      instance = TestUtils.renderIntoDocument(<PingFormStub />);
    });

    describe('inputs', function() {
      it('should contain inputs with type \'text\'', function() {
        var inputs = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'input');
        var inputsArray = Array.prototype.slice.call(inputs);
        var types = {};
        inputsArray.forEach(function(element) {
          if (!types[element.props.type]) {
            types[element.props.type] = 0;
          }
          types[element.props.type]++;
        });
        expect(types.text).to.equal(2);
      });
    });

    describe('buttons', function() {
      it('should contain \'Send\' and \'Cancel\' buttons', function() {
        var buttons = TestUtils.scryRenderedDOMComponentsWithTag(instance, 'button');

        var sendButton = false;
        var cancelButton = false;
        for (var i = 0; i < buttons.length; i++) {
          if (buttons[i].props.children === 'Send') {
            sendButton = true;
          } else if (buttons[i].props.children === 'Cancel') {
            cancelButton = true;
          }
        }

        expect(sendButton).to.equal(true);
        expect(cancelButton).to.equal(true);
      });
    });
  });
});
