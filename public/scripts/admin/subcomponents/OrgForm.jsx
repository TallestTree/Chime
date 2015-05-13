var React = require('react');
var Router = require('react-router');
var Form = require('../../shared/form.jsx');
var utils = require('../../shared/utils.jsx');

var OrgForm = React.createClass({
  mixins: [Router.Navigation],
  handleSubmit: function(e) {
    e.preventDefault();

    utils.makeRequest({
      url: '/api/orgs/add',
      method: 'POST',
      data: {},
      success: function(data) {

      },
      error: function(error) {

      }
    });
  },
  getInitialState: function() {
    var initialState = {};
    if (this.props.org) {
      initialState.title = 'Edit Organization';
    } else {
      intialState.title = 'Create Organization';
    }
    return initialState;
  },
  render: function() {
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
    'name',
  ],
  optional: [
    'logo',
    'welcome_message'
  ]
};

module.exports = OrgForm;
