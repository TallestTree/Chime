// Member class
var React = require('react');

var Member = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired,
    memberClick: React.PropTypes.func.isRequired
  },
  handleClick: function(e) {
    this.props.memberClick(this);
  },
  render: function() {
    return (
      <button type="button" className="col-xs-4 col-md-3 col-lg-1-5 dashboard-directory-avatar" onClick={this.handleClick}>
        <img className="dashboard-avatar-photo" src={this.props.data.photo} />
        <div className="row dashboard-avatar-footer">
          <p className="dashboard-avatar-name">{this.props.data.first_name} {this.props.data.last_name}</p>
          <p className="dashboard-small dashboard-avatar-position">{this.props.data.title}</p>
        </div>
      </button>
    );
  }
});

module.exports = Member;
