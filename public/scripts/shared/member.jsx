var React = require('react');

var Member = React.createClass({
  handleClick: function(e) {
    console.log(this.props.data.first_name, this.props.data.last_name);
  },
  render: function() {
    return (
      <div onClick={this.handleClick} className="member">
        <div className="memberName">{this.props.data.first_name} {this.props.data.last_name}</div>
        <div className="memberTitle">{this.props.data.title}</div>
      </div>
    );
  }
});

module.exports = Member;
