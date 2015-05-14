// Shared form elements
var React = require('react');

var Form = React.createClass({
  propTypes: {
    onSubmit: React.PropTypes.func.isRequired
  },
  render: function() {
    return (
      <form className="col-sm-8 col-sm-offset-2 col-xs-12" onSubmit={this.props.onSubmit}>
      {this.props.children}
      </form>
    );
  }
});

var Input = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    type: React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <div className="form-group">
        <label>{this.props.label}</label>
        <label className="warning-label hidden">Required</label>
        <input type={this.props.type} className="form-control" />
      </div>
    );
  }
});

module.exports = {
  Form: Form,
  Input: Input
};
