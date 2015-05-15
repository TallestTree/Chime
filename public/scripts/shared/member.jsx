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
      <button type="button" className="btn btn-default btn-xl btn-member" onClick={this.handleClick}>
        <img className="member-photo" src={this.props.data.photo} />
        <div className="member-info">
          <p className="member-name">{this.props.data.first_name} {this.props.data.last_name}</p>
          <p className="member-title">{this.props.data.title}</p>
        </div>
      </button>
    );
  }
});

module.exports = Member;
