import React, { Component } from 'react';

class About extends Component {
  render() {
    return (
      <div>
        <h2>About</h2>

        <p>This is <a href="http://luebken.com/">Matthias</a> fooling around with cloud technologies. Please ping me about any questions and concerns.</p>
     
        <p>Features data from: </p>
        <ul>
          <li> <a href="https://david-dm.org">david-dm.org</a> </li>
          <li> <a href="https://libraries.io/">librarios.io</a> </li>
          <li> <a href="https://npms.io/">npms.io</a> </li>
          <li> <a href="https://snyk.io/">snyk</a> </li>
          <li> <a href="https://www.versioneye.com//">versioneye</a> </li>
        </ul>

        <p>Source can be found here: <a href="https://github.com/luebken/stpl"> github.com/luebken/stpl </a></p>

      </div>
    );
  }
}

export default About;
