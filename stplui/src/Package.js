import React, { Component } from 'react';
import { Input, Accordion, Icon, Segment, Image, Label, Table } from 'semantic-ui-react'
import { GqlQuery } from './gql'

class Package extends Component {

  constructor() {
    super()
    this.setStateFromWindowLocationHash()
    this.getDataFromServer()
  }

  NumberedLabel(label, value) {
    var color = 'red'
    if (value > 0.70) {
      color = 'orange'
    }
    if (value > 0.80) {
      color = 'yellow'
    }
    if (value > 0.90) {
      color = 'green'
    }
    var scoring =
      < Label color={color}>
        {label}<Label.Detail>
          {value ? (value * 100).toFixed(2) : ''}
        </Label.Detail>
      </Label >
    return scoring
  }


  render() {
    console.log('Package.render() State: ', this.state)

    var keywords = '';
    if (this.state.fullresult && this.state.fullresult.main.keywords) {
      console.log('state.fullresult ', this.state.fullresult)
      keywords = this.state.fullresult.main.keywords.map((keyword) =>
        <Label horizontal key={keyword}>{keyword}</Label>
      );
    }

    var dependencies;
    if (this.state.fullresult && this.state.fullresult.npms) {
      dependencies = this.state.fullresult.npms.collected.metadata.dependencies.map((depdendency) =>
        <Table.Row key={depdendency.name}>
          <Table.Cell collapsing><a target="_blank" href={'/#/package/npm/' + depdendency.name}> {depdendency.name} </a> </Table.Cell>
          <Table.Cell>{depdendency.version}</Table.Cell>
        </Table.Row>
      );
    }
    return (
      <div>
        <h2 style={{ 'display': 'inline-block', 'marginRight': '10px' }}>Package</h2>
        <InputSearch name={this.state.name} submitHandler={this.handleInputSubmit.bind(this)} />
        <br />
        <br />

        <Segment style={{ 'display': this.state.loading ? 'block' : 'none' }} loading={this.state.loading}>
          <Image style={{ 'display': this.state.loading ? 'block' : 'none' }} src='paragraph.png' />
        </Segment>

        <Segment.Group style={{ 'display': this.state.name && !this.state.loading ? 'block' : 'none' }} >
          <Segment.Group horizontal >
            <Segment><span style={{ 'color': '#b0b0b0' }}>Description:</span> {this.state.fullresult ? this.state.fullresult.main.description : ''}</Segment>
            <Segment><span style={{ 'color': '#b0b0b0' }}>Latest version: </span>{this.state.fullresult && this.state.fullresult.npms ? this.state.fullresult.npms.collected.metadata.version : ''}</Segment>
            <Segment style={{ 'padding': '10px' }}>
              <a href={this.state.fullresult ? this.state.fullresult.main.repository : ''}>
                <Icon name='github' size='big' />
              </a>
              <a href={this.state.fullresult ? this.state.fullresult.main.homepage : ''}>
                <Icon name='home' size='big' />
              </a>
            </Segment>
          </Segment.Group >
          <Segment><span style={{ 'color': '#b0b0b0' }}>Score: </span>
            {this.NumberedLabel('Popularity:', this.state.fullresult && this.state.fullresult.npm && this.state.fullresult.npm.score ? this.state.fullresult.npm.score.popularity : '')}
            {this.NumberedLabel('Quality:', this.state.fullresult && this.state.fullresult.npm && this.state.fullresult.npm.score ? this.state.fullresult.npm.score.quality : '')}
            {this.NumberedLabel('Maintenance:', this.state.fullresult && this.state.fullresult.npm && this.state.fullresult.npm.score ? this.state.fullresult.npm.score.maintenance : '')}
          </Segment>
          <Segment.Group horizontal >
            <Segment>
              <span style={{ 'color': '#b0b0b0' }}>Status: </span>
              <span style={{ 'color': this.state.fullresult && this.state.fullresult.daviddm && this.state.fullresult.daviddm.status === 'insecure' ? '#db2828' : '#b0b0b0' }}>
                {this.state.fullresult && this.state.fullresult.daviddm ? this.state.fullresult.daviddm.status : ''}
              </span>
              <a href={this.state.fullresult ? 'https://david-dm.org/' + this.state.fullresult.main.repository + '/' + this.state.fullresult.main.name : ''}> david-dm.org</a>
            </Segment>
            <Segment>
              <span style={{ 'color': '#b0b0b0' }}>License: </span>
              {this.state.fullresult ? this.state.fullresult.main.license : ''}
              <a href={this.state.fullresult ? 'https://spdx.org/licenses/' + this.state.fullresult.main.license + '.html' : ''}> spdx.org</a>
            </Segment>
          </Segment.Group >

          <Segment><span style={{ 'color': '#b0b0b0' }}>Keywords:</span> {keywords}</Segment>
          <Segment>
            <Table celled striped>
              <Table.Body>
                <Table.Row>
                  <Table.Cell colSpan='2'>Dependencies: {this.state.fullresult && this.state.fullresult.npms ? this.state.fullresult.npms.collected.metadata.dependencies.length : ''}</Table.Cell>
                </Table.Row>
                {dependencies}
              </Table.Body>

            </Table>
          </Segment>


          <Segment>
            <p>More:</p>
            <ul>
              <li><a href={'https://www.npmjs.com/package/' + this.state.name}>https://www.npmjs.com/package/{this.state.name}</a></li>
              <li><a href={'https://npms.io/search?q=' + this.state.name}>https://npms.io/search?q={this.state.name}</a></li>
              <li><a href={'https://api.npms.io/v2/package/' + this.state.name}>https://api.npms.io/v2/package/{this.state.name}</a></li>
              <li><a href={'https://snyk.io/vuln/npm:' + this.state.name}>https://snyk.io/vuln/npm:{this.state.name}</a></li>
              <li><a href={'https://libraries.io/npm/' + this.state.name}>https://libraries.io/npm/{this.state.name}</a></li>
              <li><a href={'https://www.versioneye.com/nodejs/' + this.state.name}>https://www.versioneye.com/nodejs/{this.state.name}</a></li>
              {/* TODO DavidDM */}
            </ul>
          </Segment>
          <Segment>
            <Accordion style={{ 'display': this.state.name ? 'block' : 'none' }}>
              <Accordion.Title>  <Icon name='dropdown' /> Debug </Accordion.Title>
              <Accordion.Content>
                <div><pre>{JSON.stringify(this.state.fullresult, null, 2)}</pre></div>
              </Accordion.Content>
            </Accordion>
          </Segment>
        </Segment.Group >


      </div >
    );
  }

  setStateFromWindowLocationHash() {
    var regEx = /#\/package\/(.*)\/(.*)/.exec(window.location.hash)
    if (regEx) {
      this.state = {
        ecosystem: regEx[1],
        name: regEx[2],
        loading: true
      };
    } else {
      this.state = {
        ecosystem: '',
        name: '',
      };
    }
  }

  handleInputSubmit(value) {
    console.log('Package.handleSubmit()')
    window.location.hash = '/package/npm/' + value
    this.setStateFromWindowLocationHash()
    this.getDataFromServer()
  }

  getDataFromServer() {
    if (this.state.name) {
      var that = this
      that.setState({
        loading: true
      });
      const variables = { 'name': this.state.name, 'ecosystem': this.state.ecosystem }
      GqlQuery(variables, true).then(result => {
        console.log("Result from GqlQuery: ", result)

        if (result.status === 200) {
          that.setState({
            fullresult: result,
            loading: false
          });
        } else if (result.status === 404) {
          //console.log('404 trying again in 3 seconds')
          //setTimeout(that.getDataFromServer(), 5000);
        } else {
          console.log("Err. Unkown status ", result.status, ' Body:', result.body)
          that.setState({ description: 'dummy desc' });
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }


}

// A simple search box.
class InputSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.name };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    console.log('InputSearch.handleSubmit()')
    event.preventDefault();
    this.props.submitHandler(this.state.value)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} style={{ 'display': 'inline-block' }}>
        <Input autoFocus value={this.state.value} onChange={this.handleChange} onSubmit={this.handleSubmit} placeholder='NPM package name' icon="search" />
      </form>
    )
  }
}

export default Package;
