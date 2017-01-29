import React, { Component } from 'react';
import Client from '../data/Client';
import SignupLoginForm from './SignupLoginForm';
import logo from '../assets/logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testResult: 'pending',
      user: null
    };

    // @TODO refactor this garbage once class properties are legit
    this.handleReceiveUser = this.handleReceiveUser.bind(this);
    this.renderUserBody = this.renderUserBody.bind(this);
  };

  componentDidMount() {
    Client.test((response) => this.setState({testResult: response.test}));
  };

  handleReceiveUser(response) {
    const user = response.user;
    this.setState({ user });
  };

  renderUserBody() {
    const { user } = this.state;
    if (user === null) {
      return (
        <SignupLoginForm
          onLogin={Client.login}
          onSignup={Client.signup}
          onReceiveUser={this.handleReceiveUser}
        />
      );
    } else if (!user.email) {
      return <div>You're logged in as an unknown user, WTF!</div>;
    }
    return <div>Congrats! You are logged in with email {user.email} </div>;
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
        {this.renderUserBody()}
      </div>
    );
  }
}

export default App;
