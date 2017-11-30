import React, { Component } from 'react'
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'
import * as cognito from './cognito-utils';

export default class LoginForm extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }
  componentWillMount() {
    this.setState({ message: "" })
    document.body.classList.add('login')
  }

  componentWillUnmount() {
    document.body.classList.remove('login')
  }

  handleUsernameChange(e) {
    this.setState({ Username: e.target.value });
  }
  handlePasswordChange(e) {
    this.setState({ Password: e.target.value });
  }

  handleSubmit(e) {
    var that = this
    cognito.SignIn(this.state).then(function (result) {
      console.log('worked', result);
    }, function (err) {
      that.setState({ message: "Login failed. Please try again." })
      //console.log( err); // Error: "It broke"
    })
  }


  render() {
    return (
      <Grid
        textAlign='center'
        style={{ height: '100%' }}
        verticalAlign='middle'
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' textAlign='center'>
            Log-in
          </Header>
          <p>{this.state.message}</p>
          <Form size='large' onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                icon='user'
                iconPosition='left'
                placeholder='Username'
                onChange={this.handleUsernameChange}
              />
              <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                onChange={this.handlePasswordChange}

              />
              <Button fluid size='large' type="submit" >Login</Button>
            </Segment>
          </Form>
          {/* 
          <Message>
            New to us? <a href='#'>Sign Up</a>
          </Message>
          */}
        </Grid.Column>
      </Grid>
    )
  }
}