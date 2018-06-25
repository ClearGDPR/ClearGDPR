import React from 'react';
import PropTypes from 'prop-types';

import ChangePassword from '../../components/Users/ChangePassword';
import config from '../../config';
import session from '../../helpers/Session';
import { PanelConsumer } from '../MainLayout/PanelContext';

export class ChangePasswordContainer extends React.Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    closePanel: PropTypes.func
  };

  state = {
    isLoading: false,
    errors: {}
  };

  async changePassword(userId, password) {
    const response = await fetch(
      `${config.API_URL}/api/management/users/${userId}/update-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.getToken()}`
        },
        body: JSON.stringify({
          password
        })
      }
    );

    if (!response.ok) {
      if (response.status === 400) throw new Error(await response.json().message);
      else throw new Error('Unknown error occurred');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error('Unknown error occurred');
    }
  }

  startLoading() {
    this.setState({
      isLoading: true
    });
  }

  stopLoading() {
    this.setState({
      isLoading: false
    });
  }

  validatePassword(password) {
    // TODO: todo add proper validation
    if (!password) {
      return {
        error: 'Field required'
      };
    }
    if (password.length < 8) {
      return {
        error: 'Password must have min. 8 characters'
      };
    }
    return {
      success: null
    };
  }

  onSubmit(data) {
    const { newPassword, newPasswordRepeat } = data;

    if (newPassword !== newPasswordRepeat) {
      this.setState({
        errors: {
          newPasswordRepeat: 'Passwords do not match!'
        }
      });
      return;
    }

    this.startLoading();

    this.changePassword(this.props.userId, newPassword)
      .then(this.stopLoading.bind(this))
      .then(() => this.props.closePanel && this.props.closePanel())
      .catch(this.stopLoading.bind(this));
  }

  render() {
    return (
      <ChangePassword
        errors={this.state.errors}
        validatePassword={this.validatePassword}
        onSubmit={this.onSubmit.bind(this)}
        isLoading={this.state.isLoading}
      />
    );
  }
}

export default props => (
  <PanelConsumer>
    {({ closePanel }) => <ChangePasswordContainer {...props} closePanel={closePanel} />}
  </PanelConsumer>
);
