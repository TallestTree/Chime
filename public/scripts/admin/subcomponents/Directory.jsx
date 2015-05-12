var React = require('react');
var Navigation = require('react-router').Navigation;
var Member = require('../../shared/member.jsx');

var Directory = React.createClass({
  mixins: [Navigation],
  memberClick: function(self) {
    this.transitionTo('editUser', {user: self.props.data.id});
  },
  render: function() {
    var members;
    if (this.props.members.length > 0) {
      members = this.props.members.map(function(member) {
        return (
          <Member key={member.id} data={member} memberClick={this.memberClick} />
        );
      }.bind(this));
    } else {
      members = ( <div>Loading directory</div> );
    }
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
