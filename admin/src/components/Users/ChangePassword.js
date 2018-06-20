import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../core/cards/dashboard/TextInput';

class ChangePassword extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func
  };

  state = {
    newPassword: {
      text: '',
      error: null
    },
    newPasswordRepeat: {
      text: '',
      error: null
    }
  };

  static getPasswordError(password) {
    // TODO: todo add proper validation
    if (!password) {
      return 'Field required';
    }
    if (password.length < 8) {
      return 'Password must have min. 8 characters';
    }
    return null;
  }

  onNewPasswordChange(text) {
    this.setState({
      newPassword: {
        text,
        error: ChangePassword.getPasswordError(text)
      }
    });
  }

  onNewPasswordRepeatChange(text) {
    this.setState({
      newPasswordRepeat: {
        text,
        error: ChangePassword.getPasswordError(text)
      }
    });
  }

  onSubmit(e) {
    e.preventDefault();

    if (!this.isFormValid()) return;

    this.props.onSubmit && this.props.onSubmit();
  }

  isFormValid() {
    return (
      !ChangePassword.getPasswordError(this.state.newPassword.text) &&
      !ChangePassword.getPasswordError(this.state.newPasswordRepeat.text)
    );
  }

  renderSubmit() {
    if (this.isFormValid()) {
      return <input type="submit" className="btn" value="Save" />;
    } else {
      return <input type="submit" className="btn" value="Save" disabled />;
    }
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <TextInput
          for="new-password"
          value={this.state.newPassword.text}
          label="New password"
          placeholder="*********"
          onTextChange={this.onNewPasswordChange.bind(this)}
          error={!!this.state.newPassword.error}
          errorMessage={this.state.newPassword.error}
        />
        <TextInput
          for="new-password"
          value={this.state.newPasswordRepeat.text}
          label="Repeat new password"
          placeholder="*********"
          onTextChange={this.onNewPasswordRepeatChange.bind(this)}
          error={!!this.state.newPasswordRepeat.error}
          errorMessage={this.state.newPasswordRepeat.error}
        />
        <div>{this.renderSubmit()}</div>
      </form>
    );
  }
}

ChangePassword.propTypes = {};

export default ChangePassword;
