var React = require('react');
var Router = require('react-router');

var Member = require('./Member.jsx');

// React class for the member list that will render all of the members
var MemberList = React.createClass({
  render: function() {
    // Generate the divs for each member in the data passed in
    var members = this.props.members.map(function(member) {
      return (
        <Member key={member.id} data={member} />
      );
    });
    return (
      <div className="member-list">
        {members}
      </div>
    );
  }
});

module.exports = MemberList;
