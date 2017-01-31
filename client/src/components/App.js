import React, { Component } from 'react';
import Client from '../data/Client';
import SignupLoginForm from './SignupLoginForm';
import logo from '../assets/logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      errors: {
        signupLoginForm: ['Please enter a valid email address']
      }
    };

    // @TODO refactor this garbage once class properties are legit
    this.handleReceiveUser = this.handleReceiveUser.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  };

  componentDidMount() {
    Client.checkSession((response) => {
      const user = response.user;
      if (user) {
        this.setState({ user });
      }
    });
  };

  handleReceiveUser(response) {
    const user = response.user;
    this.setState({ user });
  };

  handleLogout() {
    Client.logout(
      (response) => this.setState({ user: null })
    );
  };

  renderLogoutButton() {
    const { user } = this.state;
    if (user === null) {
      return null;
    }
    return <button onClick={this.handleLogout}>Log out</button>;
  };

  renderUserBody() {
    const { user, errors } = this.state;
    if (user === null) {
      return (
        <SignupLoginForm
          onLogin={Client.login}
          onSignup={Client.signup}
          onReceiveUser={this.handleReceiveUser}
          errors={errors.signupLoginForm}
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
        {this.renderUserBody()}
        {this.renderLogoutButton()}
      </div>
    );
  }
}

export default App;
