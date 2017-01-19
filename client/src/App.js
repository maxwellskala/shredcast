import React, { Component } from 'react';
import Client from './Client';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {testResult: 'pending'};
  };

  componentDidMount() {
    Client.test((response) => this.setState({testResult: response.test}));
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p>Test result: {this.state.testResult}</p>
      </div>
    );
  }
}

export default App;
