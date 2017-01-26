import React, { Component } from 'react';
import Client from './Client';
import logo from './logo.svg';
import './App.css';

const USERNAME = 'username';
const PASSWORD = 'password';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testResult: 'pending',
      [USERNAME]: '',
      [PASSWORD]: ''
    };

    // @TODO refactor this garbage once class properties are legit
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  componentDidMount() {
    Client.test((response) => this.setState({testResult: response.test}));
  };

  handleChange(stateKey) {
    return (e) => this.setState({[stateKey]: e.target.value});
  };

  handleSubmit(e) {
    e.preventDefault();
    Client.signup(
      this.state.username,
      this.state.password,
      (response) => console.log(response, 'from backend')
    );
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
        <h3>Sign up</h3>
        <form className="signup-form" onSubmit={this.handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={this.state.USERNAME}
              onChange={this.handleChange(USERNAME)}
            />
          </label>
          <label>
            Password:
            <input
              type="text"
              value={this.state.PASSWORD}
              onChange={this.handleChange(PASSWORD)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default App;
