var React = require('react');

var SectionRotatingBg = React.createClass({
  componentDidMount: function() {
    $('.dashboard-photo-background').easybg({
      images: [ // an array of background dimages
        'images/01r.jpg',
        'images/02r.jpg',
        'images/03r.jpg',
        'images/04r.jpg'
      ],
      interval: 10000,
      speed : 1000, // 1 minute
      ignoreError : false,
      changeMode : 'normal', // normal or random
      initIndex : 0,
      cloneClassId : null,
      cloneClassName : 'easybgClone',
      debug : false
    });
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
