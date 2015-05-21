var React = require('react');
var Router = require('react-router');
var Dropdown = require('react-dropdown');

var SectionRotatingBg = require('./RotatingBg.jsx');
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
      url: '/api/orgs/update',
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
  onSelect: function(option) {
    this.setState({selected: option});
  },
  render: function() {
    if (!this.props.org) {
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
      <SectionRotatingBg>
        <Form.Form onSubmit={this.handleSubmit}>
          <h3>Edit Organization</h3>
          <Form.Input label="Organization Name" type="text" ref="name" />
          <Form.Input label="Logo Url" type="url" ref="logo" />
          <Form.Input label="Welcome Message" type="text" ref="welcome_message" />
          <div className="form-group">
            <label>Default Contact</label>
            <Dropdown options={options} value={defaultOption} onChange={this.onSelect} />
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </Form.Form>
      </SectionRotatingBg>
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
