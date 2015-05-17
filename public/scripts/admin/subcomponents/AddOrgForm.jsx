var React = require('react');
var Router = require('react-router');
var Dropdown = require('react-dropdown');
var Form = require('../../shared/form.jsx');
var utils = require('../../shared/utils.jsx');

var AddOrgForm = React.createClass({
  mixins: [Router.Navigation],
  componentDidMount: function() {
    utils.fillRefs(this.props.org, this.refs, FORM_REFS);
  },
  handleSubmit: function(e) {
    e.preventDefault();

    var org = utils.pullRefs(this.refs, FORM_REFS);
    if (!org) {
      return;
    }

    utils.makeRequest({
      url: '/api/orgs/add',
      method: 'POST',
      data: org,
      success: function(data) {
        this.transitionTo('dashboard');
      }.bind(this),
      error: function(error) {
        // TODO: Display error on page
        alert(error);
      }.bind(this)
    });
  },
  render: function() {
    if (this.props.org) {
      this.transitionTo('/dashboard');
    }
    var options = [];

    return (
      <div className="container">
        <Form.Form onSubmit={this.handleSubmit}>
          <h3>Create Organization</h3>
          <Form.Input label="Organization Name" type="text" ref="name" />
          <Form.Input label="Logo Url" type="url" ref="logo" />
          <Form.Input label="Welcome Message" type="text" ref="welcome_message" />
          <button type="submit" className="btn btn-default">Submit</button>
        </Form.Form>
      </div>
    );
  }
});

var FORM_REFS = {
  required: [
    'name'
  ],
  optional: [
    'logo',
    'welcome_message'
  ]
};

module.exports = AddOrgForm;
