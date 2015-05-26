var React = require('react');
var Router = require('react-router');
var Form = require('../../shared/form.jsx');
var utils = require('../../shared/utils.jsx');

var ChangePasswordForm = React.createClass({
  mixins: [Router.Navigation],
  exitView: function() {
    this.transitionTo('dashboard');
  },
  getInitialState: function() {
    return {error: null};
  },
  handleSubmit: function(e) {
    e.preventDefault();
    this.setState({error: null});

    var passwords = utils.pullRefs(this.refs, FORM_REFS);
    if (!passwords) {
      return;
    }

    if (passwords.new_password !== $(React.findDOMNode(this.refs.repeat_password)).find('input').val()) {
      this.setState({error: 'New passwords must match'});
      return;
    }

    if (passwords.old_password === $(React.findDOMNode(this.refs.new_password)).find('input').val()) {
      this.setState({error: 'New password must not match old password'});
      return;
    }

    utils.makeRequest({
      url: '/api/users/password',
      method: 'PUT',
      data: passwords,
      success: function(data) {
        this.transitionTo('dashboard');
      }.bind(this),
      error: function(error, statusCode) {
        if (statusCode === 403) {
          this.setState({error: 'Old password is incorrect'});
        } else {
          this.setState({error: error});
        }
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="col-xs-8 col-xs-push-2 dashboard-content">
        <div className="row text-center dashboard-large">CHANGE PASSWORD</div>
        <Form.Form error={this.state.error} onSubmit={this.handleSubmit}>
          <Form.Input label="Old Password" type="password" ref="old_password" />
          <Form.Input label="New Password" type="password" ref="new_password" />
          <Form.Input label="Confirm New Password" type="password" ref="repeat_password" />
          <div className="col-md-6">
            <button type="submit" className="btn btn-default dashboard-medium dashboard-button-medium">Submit</button>
          </div>
          <div className="col-md-6">
            <button type="button" onClick={this.exitView} className="btn btn-default dashboard-medium dashboard-button-medium">Cancel</button>
          </div>
        </Form.Form>
      </div>
    );
  }
});

var FORM_REFS = {
  required: [
    'old_password',
    'new_password',
    'repeat_password'
  ],
  optional: [
  ]
};

module.exports = ChangePasswordForm;
