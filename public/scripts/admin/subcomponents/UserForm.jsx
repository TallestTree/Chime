var React = require('react');
var Router = require('react-router');
var Form = require('../../shared/form.jsx');
var utils = require('../../shared/utils.jsx');

var UserForm = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    member: React.PropTypes.object,
  },
  mixins: [Router.Navigation],
  componentDidMount: function() {
    // If a member is provided, fill in the input fields with that member's current info
    if (this.props.member) {
      FORM_REFS.optional.map(function(val) {
        $(React.findDOMNode(this.refs[val])).find('input').val(this.props.member[val] || '');
      }.bind(this));
    }
  },
  handleSubmit: function(e) {
    e.preventDefault();

    var member = utils.pullRefs(this.refs, FORM_REFS);
    // Validation
    if (!member) {
      return false;
    }
    if (member.phone) {
      member.phone = utils.parsePhone(member.phone);
      if (member.phone === false) {
        //TODO: Display error for phone number format (must have 10 numbers)
        alert('Phone number required to have 10 digits (eg. (123)456-7890)');
        return;
      }
    }

    if (this.props.member) {
      member.id = this.props.member.id;
    }

    utils.makeRequest({
      url: '/api/users' + this.props.url,
      method: 'POST',
      data: member,
      success: function(data) {
        // TODO: Add confirmation of user add
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
          <h3>{this.props.title}</h3>
          <Form.Input label="First Name" type="text" ref="first_name" />
          <Form.Input label="Last Name" type="text" ref="last_name" />
          <Form.Input label="Title" type="text" ref="title" />
          <Form.Input label="Email" type="email" ref="email" />
          <Form.Input label="Phone" type="tel" ref="phone" />
          <button type="submit" className="btn btn-default">Submit</button>
        </Form.Form>
      </div>
    );
  }
});

var FORM_REFS = {
  required: [],
  optional: [
    'first_name',
    'last_name',
    'title',
    'email',
    'phone'
  ]
};

module.exports = UserForm;
