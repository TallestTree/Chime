var React = require('react');

// Return an object containing all of the values from the refs from the form fields
var pullRefs = function(refs, fields) {
  var props = {};
  var missingRequired = false;
  var $node;

  fields.required.forEach(function(val, key) {
    $node = $(React.findDOMNode(refs[val]));
    props[val] = $node.find('input').val().trim() || null;
    if (props[val] === null) {
      // Adds basic error highlighting
      missingRequired = true;
      $node.addClass('has-error');
    } else {
      $node.removeClass('has-error');
    }
  });

  if (missingRequired) {
    return false;
  }

  fields.optional.forEach(function(val, key) {
    $node = $(React.findDOMNode(refs[val]));
    props[val] = $node.find('input').val().trim() || '';
  });

  return props;
};

// A generic helper function to make an ajax request
var makeRequest = function(params) {
  $.ajax({
    url: params.url,
    method: params.method,
    data: params.data,
    success: params.success,
    error: function(jqXHR, status, error) {
      console.error(jqXHR.responseText);
      if (params.error) {
        params.error(jqXHR.responseText);
      }
    }
  });
};

var parsePhone = function(phoneString) {
  var result = phoneString.match(/\d/g);
  if (!result || result.length !== 10) {
    return false;
  } else {
    return parseInt(result, 10);
  }
};

module.exports = {
  pullRefs: pullRefs,
  makeRequest: makeRequest,
  parsePhone: parsePhone
};
