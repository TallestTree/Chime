var React = require('react');

var pullRefs = function(refs, fields) {
  var props = {};

  fields.forEach(function(val, key) {
      props[val] = React.findDOMNode(refs[val]).value.trim();
    });

  return props;
};

module.exports = {
  pullRefs: pullRefs,
};
