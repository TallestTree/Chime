var chai = require('chai');
var expect = chai.expect;

var http = require('http');
var app = require('../../server/app');
var Promise = require('bluebird');
var dbUtils = Promise.promisifyAll(require('../../server/db/dbUtils'));
var config = process.env.DATABASE_TEST_URL || require('../../server/config/config').testdb.config;
var Browser = require('zombie');

// Suppress React's instruction to install DevTools
console.log = function() {
  var oldLog = console.log.bind(console);
  return function() {
    var args = Array.prototype.slice.call(arguments);
    for (var i=0; i<args.length; i++) {
      if (typeof args[i] === 'string' && args[i].match(/DevTools/i)) {
        args[i] = '';
      }
    }
    oldLog.apply(console, args);
  };
}();

describe('e2e', function() {
  this.timeout(10000);

  var instance;
  var url = 'http://localhost:'+process.env.PORT+'/';
  var browser = new Browser({ site: url });

  // Repeated form filling
  var fillSignup = function() {
    browser
      .fill('input[type="email"]', 'bryan@bryan') // Email
      .fill('input[type="text"]', 'Bryan') // First name
      .fill('input[data-reactid=".0.0.0.1.1.1:2.1"]', 'Lyin') // Last name
      .fill('input[type="password"]', 'bryan') // Password
      .fill('input[data-reactid=".0.0.0.1.1.1:4.1"]', 'bryan'); // Confirm password;
  };
  var fillCreateOrg = function() {
    browser
      .fill('input[type="text"]', 'Bryan\'s Heretics') // Organization name
      .fill('input[data-reactid=".0.0.0.1.1.1:1.1"]', 'Welcome to the Den of Evil') // Welcome message
      .fill('input[type="url"]', 'http://i.imgur.com/jOeOkLr.png'); // Logo
  };

  before(function(done) {
    instance = http.createServer(app).listen(process.env.PORT);
    instance.on('listening', function() {
      console.log('Listening');
      done();
    });
  });
  after(function() {
    instance.close();
    console.log('Stopped');
  });
  beforeEach(function() {
    return dbUtils.clearDbAsync(config)
      .then(function() {
        return browser.visit('/#/signup');
      });
  });

  describe('signup', function() {
    beforeEach(function() {
      fillSignup();
    });
    it('should see add organization page', function() {
      return browser.pressButton('Submit').then(function() {
        browser.assert.url(new RegExp('#\/signup\/add$'));
      });
    });
  });
  describe('add organization', function() {
    beforeEach(function() {
      fillSignup();
      return browser.pressButton('Submit')
        .then(function() {
          return browser.wait();
        }).then(function() {
          fillCreateOrg();
        });
    });
    it('should see add dashboard page', function() {
      return browser.pressButton('Submit').then(function() {
        browser.assert.url(new RegExp('#\/dashboard$'));
      });
    });
  });
  describe('dashboard', function() {
    beforeEach(function() {
      fillSignup();
      return browser.pressButton('Submit')
        .then(function() {
          return browser.wait();
        }).then(function() {
          fillCreateOrg();
          return browser.pressButton('Submit');
        }).then(function() {
          return browser.wait();
        });
    });
    it('should contain organization name', function() {
      browser.assert.text('div', new RegExp('Bryan\'s Heretics'));
    });
    it('should contain user', function() {
      browser.assert.text('span', new RegExp('Bryan Lyin'));
    });
    it('should see client welcome page', function() {
      return browser.pressButton('Launch Client').then(function() {
        browser.assert.url(new RegExp('client$'));
      });
    });
  });
  describe('client-welcome', function() {
    beforeEach(function() {
      fillSignup();
      return browser.pressButton('Submit')
        .then(function() {
          return browser.wait();
        }).then(function() {
          fillCreateOrg();
          return browser.pressButton('Submit');
        }).then(function() {
          return browser.wait();
        }).then(function() {
          return browser.pressButton('Launch Client');
        }).then(function() {
          return browser.wait();
        });
    });
    it('should contain the organization logo', function() {
      browser.assert.attribute('img[class="client-org-logo-welcome"]', 'src', 'http://i.imgur.com/jOeOkLr.png');
    });
  });
  describe('client directory', function() {
    beforeEach(function() {
      fillSignup();
      return browser.pressButton('Submit')
        .then(function() {
          return browser.wait();
        }).then(function() {
          fillCreateOrg();
          return browser.pressButton('Submit');
        }).then(function() {
          return browser.wait();
        }).then(function() {
          return browser.pressButton('Launch Client');
        }).then(function() {
          return browser.wait();
        }).then(function() {
          // There's no button to click since this click event is handled by React
          // Thus, jump directory to next location
          browser.location.href += 'directory';
          return browser.wait();
        });
    });
    it('should see client directory page', function() {
      browser.assert.text('span', new RegExp('Bryan Lyin'));
    });
  });
});
