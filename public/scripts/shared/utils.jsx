var React = require('react');

// Prepopulate a form based on the given data
var fillRefs = function(data, refs, fields) {
  if (data) {
    fields.required.map(function(val) {
      $(React.findDOMNode(refs[val])).find('input').val(data[val] || '');
    });
    fields.optional.map(function(val) {
      $(React.findDOMNode(refs[val])).find('input').val(data[val] || '');
    });
  }
};

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
    return +result.join('');
  }
};

module.exports = {
  pullRefs: pullRefs,
  fillRefs: fillRefs,
  makeRequest: makeRequest,
  parsePhone: parsePhone
};
