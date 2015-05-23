var React = require('react');

var SectionRotatingBg = React.createClass({
  componentDidMount: function() {
    if ($('.dashboard-photo-background').backstretch) {
      $('.dashboard-photo-background').backstretch([
        'images/01r.jpg',
        'images/02r.jpg',
        'images/03r.jpg',
        'images/04r.jpg'
      ], {fade: 1000, duration: 10000});
    }
  },
  render: function() {
    return (
      <section className="row dashboard-photo-background">
        {this.props.children}
      </section>
    );
  }
});

module.exports = SectionRotatingBg;
