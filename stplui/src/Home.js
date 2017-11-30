import React, { Component } from 'react';
import { Card, Icon } from 'semantic-ui-react'


class Home extends Component {
  render() {
    return (
      <div style={{ background: 'url(bg.jpg)' }}>
        <h1 style={{ 'textAlign': 'center', 'padding': '50px', 'color': 'white' }}> <i className="pied piper hat icon"></i> SHAZAM FOR APPS</h1>

        <div style={{ 'margin': '50px', 'padding': '150px' }} />

        <Card.Group>
          {/* hack */}
          <Card href='#' style={{ 'marginLeft': '35px' }}>
            <Card.Content>
              <Card.Header> Security <Icon name='lock' /> </Card.Header>
              <Card.Meta> Subheading </Card.Meta>
              <Card.Description> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. </Card.Description>
            </Card.Content>
          </Card>

          <Card href='#'>
            <Card.Content>
              <Card.Header> License <Icon name='browser' /> </Card.Header>
              <Card.Meta> Subheading </Card.Meta>
              <Card.Description> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. </Card.Description>
            </Card.Content>
          </Card>

          <Card href='#'>
            <Card.Content>
              <Card.Header> Maintainance <Icon name='comments' /> </Card.Header>
              <Card.Meta> Subheading </Card.Meta>
              <Card.Description> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. </Card.Description>
            </Card.Content>
          </Card>
        </Card.Group>

      </div>
    );
  }
}

export default Home;
