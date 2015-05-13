var React = require('react');
var Router = require('react-router');
var Form = require('../../shared/form.jsx');
var utils = require('../../shared/utils.jsx');

var OrgForm = React.createClass({
  mixins: [Router.Navigation],
  componentDidMount: function() {
    utils.fillRefs(this.props.org, this.refs, FORM_REFS);
  },
  getInitialState: function() {
    var initialState = {};
    if (this.props.org) {
      initialState.title = 'Edit Organization';
      initialState.url = '/update';
    } else {
      initialState.title = 'Create Organization';
      initialState.url = '/add';
    }
    return initialState;
  },
  handleSubmit: function(e) {
    e.preventDefault();

    var org = utils.pullRefs(this.refs, FORM_REFS);
    if (!org) {
      alert('Missing required field');
      return;
    }

    console.log(org);
    utils.makeRequest({
      url: '/api/orgs' + this.state.url,
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
