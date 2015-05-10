var React = require('react');

// Return an object containing all of the values from the refs from the form fields
var pullRefs = function(refs, fields) {
  var props = {};
  var missingRequired = false;
  var node;

  fields.required.forEach(function(val, key) {
    node = React.findDOMNode(refs[val]);
    props[val] = node.value.trim() || null;
    if (props[val] === null) {
      missingRequired = true;
      $(node).closest('.form-group').addClass('has-error');
    } else {
      $(node).closest('.form-group').removeClass('has-error');
    }
  });

  if (missingRequired) {
    return false;
  }

  fields.optional.forEach(function(val, key) {
    props[val] = React.findDOMNode(refs[val]).value.trim() || null;
  });

  return props;
};

// A generic helper function to make an ajax request
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
