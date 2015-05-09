var React = require('react');

var pullRefs = function(refs, fields) {
  var props = {};

  fields.required.forEach(function(val, key) {
    props[val] = React.findDOMNode(refs[val]).value.trim() || null;
  });

  for (var i = 0; i < fields.required.length; i++) {
    if (props[fields.required[i]] === null) {
      return false;
    }
  }

  fields.optional.forEach(function(val, key) {
    props[val] = React.findDOMNode(refs[val]).value.trim() || null;
  });

  return props;
};

var makeRequest = function(url, method, data, _success, _error) {
  $.ajax({
    url: url,
    method: method,
    data: data,
    success: function(data) {
      _success(data);
    },
    error: function(jqXHR, status, error) {
      _error(jqXHR, status, error);
    },
    timeout: 5000
  });
};

var parsePhone = function(phoneString) {
  var result = phoneString.match(/\d/g).join('');
  if (result.length !== 10) {
    return false;
  } else {
    return parseInt(result, 10);
  }
};

module.exports = {
  pullRefs: pullRefs,
};
