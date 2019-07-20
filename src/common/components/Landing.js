import React, { Component } from 'react';

class Landing extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="card" className="jumbotron jumbotron-fluid" style={{width: '100%'}}>
            <div style={{paddingLeft: '30px'}}>
              <h4>Welcome to ExTracker</h4>
              <p>The one stop app for keeping track of your exercises.</p>
              <p>Please sign in to continue.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Landing;
