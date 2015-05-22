// Shared form elements
var React = require('react');

var Form = React.createClass({
  propTypes: {
    error: React.PropTypes.string,
    onSubmit: React.PropTypes.func.isRequired
  },
  render: function() {
    return (
      <form className="dashboard-ping-form col-xs-6 col-xs-push-3" onSubmit={this.props.onSubmit}>
        <div className="warning-label">{this.props.error}</div>
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
        <input type={this.props.type} className="dashboard-input form-control dashboard-small" />
        <span className="warning-label hidden">Required</span>
      </div>
    );
  }
});

module.exports = {
  Form: Form,
  Input: Input
};
