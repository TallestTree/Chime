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
    utils.fillRefs(this.props.member, this.refs, FORM_REFS);
  },
  handleSubmit: function(e) {
    e.preventDefault();

    var member = utils.pullRefs(this.refs, FORM_REFS);
    // Validation
    if (!member) {
      return;
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
        // alert(error);
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="col-xs-8 col-xs-push-2 dashboard-content">
        <div className="row text-center dashboard-large">{this.props.title}</div>
        <div class="row dashboard-directory">
          <Form.Form onSubmit={this.handleSubmit}>
            <Form.Input label="First Name" type="text" ref="first_name" />
            <Form.Input label="Last Name" type="text" ref="last_name" />
            <Form.Input label="Title" type="text" ref="title" />
            <Form.Input label="Email" type="email" ref="email" />
            <Form.Input label="Phone" type="tel" ref="phone" />
            <div class="col-xs-6 col-xs-push-3 col-md-8 col-md-push-2">
              <button type="submit" className="btn btn-default dashboard-medium dashboard-button-medium">Submit</button>
            </div>
          </Form.Form>
        </div>
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
