var React = require('react');
var Navigation = require('react-router').Navigation;
var Member = require('../../shared/member.jsx');

var Directory = React.createClass({
  mixins: [Navigation],
  memberClick: function(self) {
    this.transitionTo('edit', {user: self.props.idx});
  },
  render: function() {
    console.log(this.props.members);
    var members = this.props.members.map(function(member, idx) {
      return (
        <Member key={member.id} idx={idx} data={member} memberClick={this.memberClick} />
      );
    }.bind(this));
    return (
      <div>
        <h4>Directory</h4>
        <div className="member-list">
        {members}
        </div>
      </div>
    );
  }
});

module.exports = Directory;
