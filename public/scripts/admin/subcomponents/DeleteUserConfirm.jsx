var React = require('react');
var Router = require('react-router');
var utils = require('../../shared/utils.jsx');

// Renders the form displayed to edit a user
var DeleteUserConfirm = React.createClass({
  propTypes: {
    members: React.PropTypes.array.isRequired
  },
  mixins: [Router.Navigation],
  exitView: function() {
    this.transitionTo('dashboard');
  },
  handleSubmit: function(e) {
    e.preventDefault();

    utils.makeRequest({
      url: '/api/users/' + this.props.params.user,
      method: 'DELETE',
      success: function(data) {
        this.transitionTo('dashboard');
      }.bind(this),
      error: function(error) {
        console.log(error);
      }.bind(this)
    });
  },
  render: function() {
    // Redirect when there is no member data (likely due to refreshing the page)
    if (!this.props.members.length) {
      this.transitionTo('dashboard');
    }

    var id = +this.props.params.user;
    var member = this.props.members.reduce(function(a,b) {
      return a || (b.id === id ? b : null);
    }, null);

    return (
      <div className="col-xs-8 col-xs-push-2 dashboard-content">
        <div className="row text-center dashboard-large">DELETE USER</div>
        <div className="row text-center dashboard-medium">Are you sure you want to delete {member.first_name} {member.last_name} from your organization?</div>
        <button type="submit" onClick={this.handleSubmit} className="btn btn-default dashboard-medium dashboard-button-medium">Confirm</button>
        <button type="submit" onClick={this.exitView} className="btn btn-default dashboard-medium dashboard-button-medium">Cancel</button>
      </div>
    );
  }
});

module.exports = DeleteUserConfirm;
