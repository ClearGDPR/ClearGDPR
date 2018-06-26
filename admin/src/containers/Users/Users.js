import React from 'react';
import PropTypes from 'prop-types';

import { PanelConsumer } from '../MainLayout/PanelContext';
import { UsersConsumer } from './UsersContext';

import Users from '../../components/Users/Users';
import ChangePassword from '../../containers/Users/ChangePassword';
import Register from './Register';

export class UsersContainer extends React.Component {
  static propTypes = {
    openPanel: PropTypes.func,
    users: PropTypes.arrayOf(PropTypes.object),
    isLoading: PropTypes.bool,
    fetchUsers: PropTypes.func
  };

  componentDidMount() {
    this.props.fetchUsers();
  }

  openChangePasswordForm(userId) {
    this.props.openPanel(ChangePassword, 'Change password', { userId });
  }

  openRegisterUserForm() {
    this.props.openPanel(Register, 'Register user');
  }

  render() {
    return (
      <Users
        users={this.props.users}
        isLoading={this.props.isLoading}
        onChangePasswordClick={this.openChangePasswordForm.bind(this)}
        onRegisterUserClick={this.openRegisterUserForm.bind(this)}
      />
    );
  }
}

export default props => (
  <PanelConsumer>
    {({ openPanel }) => (
      <UsersConsumer>
        {({ users, isLoading, fetchUsers }) => (
          <UsersContainer
            {...props}
            users={users}
            isLoading={isLoading}
            fetchUsers={fetchUsers}
            openPanel={openPanel}
          />
        )}
      </UsersConsumer>
    )}
  </PanelConsumer>
);
