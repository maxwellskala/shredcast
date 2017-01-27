import React, { Component } from 'react';
import Client from './Client';
import logo from './logo.svg';
import './App.css';

const SIGNUP = 'signup';
const LOGIN = 'login';
const EMAIL = 'email';
const PASSWORD = 'password';

class App extends Component {
  // @TODO refactor rendering/handling of signup/login to share code better
  constructor(props) {
    super(props);
    this.state = {
      testResult: 'pending',
      [SIGNUP]: {
        [EMAIL]: '',
        [PASSWORD]: ''
      },
      [LOGIN]: {
        [EMAIL]: '',
        [PASSWORD]: ''
      },
      user: null
    };

    // @TODO refactor this garbage once class properties are legit
    this.handleSignup = this.handleSignup.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.renderSignup = this.renderSignup.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
  };

  componentDidMount() {
    Client.test((response) => this.setState({testResult: response.test}));
  };

  handleChange(stateKey, fieldKey) {
    return (e) => {
      this.setState({
        ...this.state,
        [stateKey]: {
          ...this.state[stateKey],
          [fieldKey]: e.target.value
        }
      });
    };
  };

  handleSignup(e) {
    e.preventDefault();
    Client.signup(
      this.state[SIGNUP][EMAIL],
      this.state[SIGNUP][PASSWORD],
      (response) => console.log(response, 'from backend, signup')
    );
  };

  handleLogin(e) {
    e.preventDefault();
    Client.login(
      this.state[LOGIN][EMAIL],
      this.state[LOGIN][PASSWORD],
      (response) => console.log(response, 'from backend, login')
    );
  };

  renderSignup() {
    if (this.state.user !== null) {
      return null;
    }
    return (
      <div className="signup-container">
        <h3>Sign up</h3>
        <form className="signup-form" onSubmit={this.handleSignup}>
          <label>
            Email:
            <input
              type="text"
              value={this.state[SIGNUP][EMAIL]}
              onChange={this.handleChange(SIGNUP, EMAIL)}
            />
          </label>
          <label>
            Password:
            <input
              type="text"
              value={this.state[SIGNUP][PASSWORD]}
              onChange={this.handleChange(SIGNUP, PASSWORD)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  };

  renderLogin() {
    if (this.state.user !== null) {
      return null;
    }
    return (
      <div className="login-container">
        <h3>Login</h3>
        <form className="login-form" onSubmit={this.handleLogin}>
          <label>
            Email:
            <input
              type="text"
              value={this.state[LOGIN][EMAIL]}
              onChange={this.handleChange(LOGIN, EMAIL)}
            />
          </label>
          <label>
            Password:
            <input
              type="text"
              value={this.state[LOGIN][PASSWORD]}
              onChange={this.handleChange(LOGIN, PASSWORD)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
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
        {this.renderSignup()}
        {this.renderLogin()}
      </div>
    );
  }
}

export default App;
