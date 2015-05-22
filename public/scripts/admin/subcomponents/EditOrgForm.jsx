var React = require('react');
var Router = require('react-router');
var Dropdown = require('react-dropdown');
var Form = require('../../shared/form.jsx');
var utils = require('../../shared/utils.jsx');

var EditOrgForm = React.createClass({
  mixins: [Router.Navigation],
  componentDidMount: function() {
    utils.fillRefs(this.props.org, this.refs, FORM_REFS);

    var members = this.props.members;
    var defaultMember;
    for (var i = 0; i < members.length; i++) {
      if (members[i].id === this.props.org.default_id) {
        defaultMember = members[i];
        break;
      }
    }
    var defaultOption = {value: defaultMember.id, label: defaultMember.first_name + ' ' + defaultMember.last_name};
    this.setState({selected: defaultOption});
  },
  confirmDelete: function() {
    this.transitionTo('deleteOrg');
  },
  getInitialState: function() {
    return {};
  },
  handleSubmit: function(e) {
    e.preventDefault();

    var org = utils.pullRefs(this.refs, FORM_REFS);
    if (!org) {
      return;
    }
    org.default_id = this.state.selected.value;

    utils.makeRequest({
      url: '/api/orgs',
      method: 'PUT',
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
  onSelect: function(option) {
    this.setState({selected: option});
  },
  render: function() {
    if (!this.props.org.name) {
      this.transitionTo('/dashboard');
    }
    var options = [];
    var defaultOption = this.state.selected;

    var members = this.props.members;
    for (var j = 0; j < members.length; j++) {
      options.push({
        value: members[j].id,
        label: members[j].first_name + ' ' + members[j].last_name
      });
    }

    return (
      <div className="col-xs-8 col-xs-push-2 dashboard-content">
        <div className="row text-center dashboard-large">EDIT ORGANIZATION</div>
        <Form.Form onSubmit={this.handleSubmit}>
          <Form.Input label="Organization Name" type="text" ref="name" />
          <Form.Input label="Logo Url" type="url" ref="logo" />
          <Form.Input label="Welcome Message" type="text" ref="welcome_message" />
          <div className="form-group">
            <label className="text-left dashboard-medium">Default Contact</label>
            <Dropdown options={options} value={defaultOption} onChange={this.onSelect} />
          </div>
          <div className="col-xs-6 col-xs-push-3 col-md-8 col-md-push-2">
            <button type="submit" className="btn btn-default dashboard-medium dashboard-button-medium">Submit</button>
            <button type="button" onClick={this.confirmDelete} className="btn btn-default dashboard-medium dashboard-button-medium dashboard-button-red">Delete Organization</button>
          </div>
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

module.exports = EditOrgForm;
