import React, { Component } from 'react';
import './SignupLoginForm.css';

const EMAIL = 'email';
const PASSWORD = 'password';

class SignupLoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: true,
      [EMAIL]: '',
      [PASSWORD]: ''
    };

    this.getFormToggleText = this.getFormToggleText.bind(this);
    this.handleFormToggle = this.handleFormToggle.bind(this);
    this.renderErrors = this.renderErrors.bind(this);
  };

  getFormToggleText(showLogin) {
    const className = 'toggle-form-text';
    return showLogin
      ? (
          <p className={className}>
            Don't have an account? <a onClick={this.handleFormToggle}>Signup</a>
          </p>
        )
      : (
          <p className={className}>
            Already have an account? <a onClick={this.handleFormToggle}>Login</a>
          </p>
        );
  };

  getHandleChange(stateKey) {
    return (e) => {
      return this.setState({ [stateKey]: e.target.value });
    };
  };

  handleFormToggle() {
    this.setState((prevState, props) => {
      return { ...prevState, showLogin: !prevState.showLogin };
    })
  };

  renderErrors() {
    const { errors } = this.props;
    if (!errors || !errors.length) {
      return null;
    }
    const errorChildren = errors.map((errorText) => {
      return <p key={errorText} className='error'>{errorText}</p>;
    });
    return (
      <div className='errors-container'>
        {errorChildren}
      </div>
    );
  };

  render() {
    const { onLogin, onSignup, onReceiveUser } = this.props;
    const { showLogin, email, password } = this.state;
    const clientHook = showLogin ? onLogin : onSignup;
    const handleSubmit = (e) => {
      e.preventDefault();
      clientHook(
        email,
        password,
        onReceiveUser
      );
    };
    return (
      <div className='SignupLoginForm'>
        <h3>{showLogin ? 'Login' : 'Signup'}</h3>
        {this.getFormToggleText(showLogin)}
        {this.renderErrors()}
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type='text'
              value={email}
              onChange={this.getHandleChange(EMAIL)}
            />
          </label>
          <label>
            Password:
            <input
              type='text'
              value={password}
              onChange={this.getHandleChange(PASSWORD)}
            />
          </label>
          <button type='submit' value='Submit'>Submit</button>
        </form>
      </div>
    );
  };
}

SignupLoginForm.propTypes = {
  onLogin: React.PropTypes.func.isRequired,
  onSignup: React.PropTypes.func.isRequired,
  onReceiveUser: React.PropTypes.func.isRequired,
  errors: React.PropTypes.array
}

export default SignupLoginForm;
