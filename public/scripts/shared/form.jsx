// Shared form elements
var React = require('react');

var Form = React.createClass({
  propTypes: {
    onSubmit: React.PropTypes.func.isRequired
  },
  render: function() {
    return (
      <form className="dashboard-ping-form col-xs-6 col-xs-push-3" onSubmit={this.props.onSubmit}>
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
        <label className="text-left dashboard-medium">{this.props.label}</label>
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
