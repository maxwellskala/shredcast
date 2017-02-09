import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import { wrapAndSetState, setStateAndRender } from './utils';
import App from '../components/App';
import SignupLoginForm from '../components/SignupLoginForm';

const USER_EMAIL = 'test@test.com';
const USERFUL_STATE = {
  user: {
    email: USER_EMAIL
  }
};

describe('<App />', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('renders SignupLoginForm if no user in state', () => {
    const app = shallow(<App />);
    expect(app.find(SignupLoginForm).length).toBe(1);
  });

  it('does not render SignupLoginForm if user in state', () => {
    const app = wrapAndSetState(<App />, USERFUL_STATE);
    expect(app.find(SignupLoginForm).length).toBe(0);
  });

  it('does not render logout button if no user in state', () => {
    const userLessState = {
      user: null
    };
    const app = setStateAndRender(<App />, userLessState);
    const buttons = app.find('button');
    expect(buttons.length).toBe(1);
    expect(buttons.text()).toContain('Submit');
  });

  it('renders a welcome message with the user email if user in state', () => {
    const rendered = setStateAndRender(<App />, USERFUL_STATE);
    expect(rendered.find('.logged-in-message').text()).toContain(USER_EMAIL);
  });

  it('renders a warning message if user in state but user has no email', () => {
    const state = {
      user: {}
    };
    const rendered = setStateAndRender(<App />, state);
    expect(rendered.find('.logged-in-message').text()).toContain('WTF');
  });

  it('renders a logout button if user in state', () => {
    const rendered = setStateAndRender(<App />, USERFUL_STATE);
    const buttons = rendered.find('button');
    expect(buttons.length).toBe(1);
    expect(buttons.text()).toContain('Log out');
  });
})
