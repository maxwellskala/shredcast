import React from 'react';

import { wrapAndSetState, setStateAndRender } from './utils';
import SignupLoginForm from '../components/SignupLoginForm';

const EMPTY_FUNCTION = () => {};
const EMPTY_PROPS = {
  onLogin: EMPTY_FUNCTION,
  onSignup: EMPTY_FUNCTION,
  onReceiveUser: EMPTY_FUNCTION,
  errors: [],
};
const ERRORS = ['This is an error', 'As is this'];
const ERRORS_LENGTH = ERRORS.length;

describe('<SignupLoginForm />', () => {
  it('shows login header when showLogin === true', () => {
    const signupLoginForm = setStateAndRender(
      <SignupLoginForm {...EMPTY_PROPS} />,
      { showLogin: true }
    );
    const h3s = signupLoginForm.find('h3');
    expect(h3s.length).toBe(1);
    expect(h3s.text()).toBe('Login');
  });

  it('shows signup toggle when showLogin === true', () => {
    const signupLoginForm = setStateAndRender(
      <SignupLoginForm {...EMPTY_PROPS} />,
      { showLogin: true }
    );
    const anchors = signupLoginForm.find('a');
    expect(anchors.length).toBe(1);
    expect(anchors.text()).toBe('Signup');
  });

  it('shows signup header when showLogin === false', () => {
    const signupLoginForm = setStateAndRender(
      <SignupLoginForm {...EMPTY_PROPS} />,
      { showLogin: false }
    );
    const h3s = signupLoginForm.find('h3');
    expect(h3s.length).toBe(1);
    expect(h3s.text()).toBe('Signup');
  });

  it('shows login toggle when showLogin === false', () => {
    const signupLoginForm = setStateAndRender(
      <SignupLoginForm {...EMPTY_PROPS} />,
      { showLogin: false }
    );
    const anchors = signupLoginForm.find('a');
    expect(anchors.length).toBe(1);
    expect(anchors.text()).toBe('Login');
  });

  it('does not render .errors-container when no errors', () => {
    const signupLoginForm = setStateAndRender(
      <SignupLoginForm {...EMPTY_PROPS} />,
      {}
    );
    expect(signupLoginForm.find('.errors-container').length).toBe(0);
  });

  it('renders .errors-container when there are errors', () => {
    const errors = ['This is an error'];
    const props = {
      ...EMPTY_PROPS,
      errors
    };
    const signupLoginForm = setStateAndRender(
      <SignupLoginForm {...props} />,
      {}
    );
    expect(signupLoginForm.find('.errors-container').length).toBe(1);
  });

  it('renders multiple errors if there are more than one', () => {
    const props = {
      ...EMPTY_PROPS,
      errors: ERRORS
    };
    const signupLoginForm = setStateAndRender(
      <SignupLoginForm {...props} />,
      {}
    );
    expect(signupLoginForm.find('.errors-container .error').length)
      .toBe(ERRORS_LENGTH);
  });

  it('renders error text correctly', () => {
    const props = {
      ...EMPTY_PROPS,
      errors: ERRORS
    };
    const signupLoginForm = wrapAndSetState(
      <SignupLoginForm {...props} />,
      {}
    );
    const errors = signupLoginForm.find('.errors-container .error');
    errors.forEach((error, i) => {
      expect(error.text()).toEqual(ERRORS[i])
    });
  });
});