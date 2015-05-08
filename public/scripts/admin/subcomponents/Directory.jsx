var React = require('react');
var Navigation = require('react-router').Navigation;
var Member = require('../../shared/member.jsx');

var Directory = React.createClass({
  mixins: [Navigation],
  memberClick: function(self) {
    for (var i = 0; i < this.props.members.length; i++) {
      if (self.props.data === this.props.members[i]) {
        var memberIndex = i;
        continue;
      }
    }
    if (!memberIndex) {
      console.error('Error: did not find member within retrieved data');
      return
    }
    this.transitionTo('edit', {user: memberIndex});
  },
  render: function() {
    console.log(this.props.members);
    var members = this.props.members.map(function(member) {
      return (
        <Member key={member.id} data={member} memberClick={this.memberClick} />
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
