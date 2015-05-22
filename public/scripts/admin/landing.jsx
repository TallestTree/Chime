var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var NavBar = require('./subcomponents/NavBar.jsx');
var SectionRotatingBg = require('./subcomponents/RotatingBg.jsx');

var Landing = React.createClass({
  toAbout: function(e) {
    e.preventDefault();
    window.history.pushState({}, 'About', '/#/');
    document.body.scrollTop = document.getElementById('about').offsetTop;
  },
  render: function() {
    return (
      <div>
        <SectionRotatingBg>
          <NavBar page="landing" />
          <div className="col-xs-6 col-xs-push-3 dashboard-content-landing">
            <div className="row">
              <div className="col-xs-6 col-xs-push-3 col-md-4 col-md-push-4">
                <img className="dashboard-app-logo" src="images/logo_03.png"/>
              </div>
            </div>
            <div className="text-center dashboard-medium-intro col-xs-12">
              <p>Chime is a tablet-based reception solution for the workplace.</p>
              <p>New to Chime? Learn more below.</p>
            </div>
            <div className="col-xs-12 text-center page-scroll">
              <a href="" onClick={this.toAbout}><span className="glyphicon glyphicon-chevron-down dashboard-glyphicons"></span></a>
            </div>
          </div>
        </SectionRotatingBg>
        <section id="about">
          <div className="row dashboard-features-white">

            <div className="text-center dashboard-extralarge-features">
              <p>About Chime</p>
            </div>

            <div className="row col-xs-10 col-xs-push-1">

              <div className="col-xs-5 col-xs-push-1">
                <img src="images/ipad-02-screenshot-welcome-02.png" className="col-xs-12" />
              </div>

              <div className="text-center vertical-center col-xs-5 col-xs-push-6">
                <p className="dashboard-large-features">Welcome All</p>
                <p className="dashboard-medium-features">The Chime Client provides your office with a way to ensure that every visitor is greeted and assisted.</p>
              </div>

            </div>

          </div>

          <div className="row dashboard-features-grey">

            <div className="row col-xs-10 col-xs-push-1">

              <div className="text-center vertical-center col-xs-5 col-xs-push-1">
                <p className="dashboard-large-features">Best Face Forward</p>
                <p className="dashboard-medium-features">Visitors can see all of your staff and their titles, and select the right contact for their needs.</p>
              </div>

              <div className="col-xs-5 col-xs-push-6">
                <img src="images/ipad-02-screenshot-directory-03.png" className="col-xs-12" />
              </div>

            </div>

          </div>

          <div className="row dashboard-features-white">

            <div className="row col-xs-10 col-xs-push-1">

              <div className="col-xs-5 col-xs-push-1">
                <img src="images/ipad-02-screenshot-ping-02.png" className="col-xs-12" />
              </div>

              <div className="text-center vertical-center col-xs-5 col-xs-push-6">
                <p className="dashboard-large-features">Touch Base</p>
                <p className="dashboard-medium-features">Your guests can then ping their contact, add their own custom message, and get a confirmation.</p>
              </div>

            </div>

          </div>

          <div className="row dashboard-features-grey">

            <div className="row col-xs-10 col-xs-push-1">

              <div className="text-center vertical-center col-xs-5 col-xs-push-1">
                <p className="dashboard-large-features">Take Control</p>
                <p className="dashboard-medium-features">The Chime Dashboard allows you to manage your organization, its members, and their contact info.</p>
              </div>

              <div className="col-xs-5 col-xs-push-6">
                <img src="images/imac-01-screenshot-dashboard.png" className="col-xs-12" />
              </div>

            </div>

          </div>

          <div className="row dashboard-features-white">

            <div className="row col-xs-10 col-xs-push-1 text-center">

              <p className="dashboard-extralarge-features">Ready to get started?</p>

              <div className="row">
                <form className="col-xs-10 col-xs-push-1">
                  <div className="col-xs-6 col-xs-push-3 col-lg-4 col-lg-push-4">
                    <Link to="signup" className="btn btn-default dashboard-button-medium-black dashboard-large">Sign Up</Link>
                  </div>
                </form>
              </div>

            </div>

          </div>
        </section>
      </div>
    );
  }
});
      // </div>

module.exports = Landing;
