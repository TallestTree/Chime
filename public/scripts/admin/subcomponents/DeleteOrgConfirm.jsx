var React = require('react');
var Router = require('react-router');
var utils = require('../../shared/utils.jsx');

// Renders the form displayed to edit a user
var DeleteOrgConfirm = React.createClass({
  mixins: [Router.Navigation],
  exitView: function() {
    this.transitionTo('dashboard');
  },
  handleSubmit: function(e) {
    e.preventDefault();

    utils.makeRequest({
      url: '/api/orgs',
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

    return (
      <div className="col-xs-8 col-xs-push-2 dashboard-content">
        <div className="row text-center dashboard-large">DELETE ORGANIZATION</div>
        <div className="row text-center dashboard-medium">
          <div className="col-xs-8 col-xs-push-2 dashboard-deletion-box">
            <p>Are you sure you want to delete your organization, including all members? This action cannot be undone.</p>
            <div className="col-xs-6 col-md-4 col-md-push-2 text-right">
              <button type="submit" onClick={this.handleSubmit} className="btn btn-default dashboard-button-small dashboard-medium">Delete</button>
            </div>
            <div className="col-xs-6 col-md-4 col-md-push-2 text-left">
              <button type="submit" onClick={this.exitView} className="btn btn-default dashboard-button-small dashboard-medium">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = DeleteOrgConfirm;
