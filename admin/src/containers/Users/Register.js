import React from 'react';
import PropTypes from 'prop-types';

import Register from 'components/Users/Register';
import { PanelConsumer } from 'containers/MainLayout/PanelContext';
import { UsersConsumer } from './UsersContext';

export class RegisterContainer extends React.Component {
  static propTypes = {
    registerUser: PropTypes.func.isRequired,
    closePanel: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired
  };

  state = {
    errors: {}
  };

  validatePassword(password) {
    // TODO: todo add proper validation
    if (!password) {
      return 'Field required';
    }
    if (password.length < 8) {
      return 'Password must have min. 8 characters';
    }
    return null;
  }

  onSubmit(data) {
    const { username, password } = data;

    this.props
      .registerUser(username, password)
      .then(() => this.props.closePanel())
      .catch(e =>
        this.setState({
          errors: {
            username: e.toString()
          }
        })
      );
  }

  render() {
    return (
      <Register
        errors={this.state.errors}
        validatePassword={this.validatePassword}
        onSubmit={this.onSubmit.bind(this)}
        isLoading={this.props.isLoading}
      />
    );
  }
}

export default props => (
  <PanelConsumer>
    {({ closePanel }) => (
      <UsersConsumer>
        {({ registerUser, isLoading }) => (
          <RegisterContainer
            {...props}
            isLoading={isLoading}
            registerUser={registerUser}
            closePanel={closePanel}
          />
        )}
      </UsersConsumer>
    )}
  </PanelConsumer>
);
