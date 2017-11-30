import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react'

import {
  HashRouter as Router,
  Route,
  NavLink
} from 'react-router-dom'
import './App.css';
import Home from './Home';
import Package from './Package';
import Application from './Application';
import Login from './LoginLayout';
import About from './About';
import * as cognito from './cognito-utils';


class App extends Component {

  handleLogOut() {
    cognito.SignOut()
    //TODO
    window.location.reload();

  }

  render() {
    var app = <Router>
      <div className="App">
        <Menu>
          <Menu.Item exact name='home' as={NavLink} to='/'>
            stpl.io
        </Menu.Item>
          <Menu.Item name='package' as={NavLink} to='/package'>
            Package
        </Menu.Item>
        {/*
        <Menu.Item name='app' as={NavLink} to='/app'>
            App
        </Menu.Item>
        */}
          <Menu.Menu position='right'>
            <Menu.Item name='logout' onClick={this.handleLogOut} />
          </Menu.Menu>
        </Menu>

        <div className="App-content">
          <Route exact path="/" component={Home} />
          <Route path="/package" component={Package} />
          <Route path="/app" component={Application} />
          <Route exact path="/about" component={About} />
        </div>

        <Menu>
          <Menu.Menu position='right'>
            <Menu.Item name='about' as={NavLink} to='/about'>
              About
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </div>
    </Router>

    return (
      <div>
        {
          (cognito.IsSignedIn()) ? app : <Login />
        }
      </div>
    );
  }
}

export default App;
