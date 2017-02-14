import React, { Component } from 'react';
import Client from '../data/Client';
import SignupLoginForm from './SignupLoginForm';
import logo from '../assets/logo.svg';
import './App.css';

// @TODO state seems fragile since we can accidentally remove an error key, fix that
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      errors: {
        signupLoginForm: []
      }
    };

    // @TODO refactor this garbage once class properties are legit
    this.handleSignupLoginResponse = this.handleSignupLoginResponse.bind(this);
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

  handleSignupLoginResponse(response) {
    const currentErrors = this.state.errors;
    const validationErrors = response.validationErrors;
    if (validationErrors) {
      this.setState({
        errors: { ...currentErrors, signupLoginForm: validationErrors }
      });
      return;
    }
    const dataErrors = response.errors;
    if (dataErrors) {
      this.setState({
        errors: { ...currentErrors, signupLoginForm: dataErrors }
      });
      return;
    }
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
    const loggedInMessageClassName = 'logged-in-message';
    if (user === null) {
      return (
        <SignupLoginForm
          onLogin={Client.login}
          onSignup={Client.signup}
          onReceiveUser={this.handleSignupLoginResponse}
          errors={errors.signupLoginForm}
        />
      );
    } else if (!user.email) {
      return (
        <div className={loggedInMessageClassName}>
          You're logged in as an unknown user, WTF!
        </div>
      );
    }
    return (
      <div className={loggedInMessageClassName}>
        Congrats! You are logged in with email {user.email}
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
        {this.renderUserBody()}
        {this.renderLogoutButton()}
      </div>
    );
  }
}

export default App;
