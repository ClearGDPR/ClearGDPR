import React from 'react';
import PropTypes from 'prop-types';

import { userType } from 'types';
import { PanelConsumer } from 'containers/MainLayout/PanelContext';
import { UsersConsumer } from './UsersContext';

import Users from 'components/Users/Users';
import ChangePassword from 'containers/Users/ChangePassword';
import Register from './Register';
import DeleteUser from './DeleteUser';

export class UsersContainer extends React.Component {
  static propTypes = {
    openPanel: PropTypes.func,
    users: PropTypes.arrayOf(userType),
    isLoading: PropTypes.bool,
    fetchUsers: PropTypes.func
  };

  state = {
    isDeleteModalOpen: false,
    userToDeleteId: 0
  };

  componentDidMount() {
    this.props.fetchUsers().catch(() => {});
  }

  openChangePasswordForm = userId => {
    this.props.openPanel(ChangePassword, 'Change password', { userId });
  };

  openRegisterUserForm = () => {
    this.props.openPanel(Register, 'Add user');
  };

  openDeleteConfirmationModal = userId => {
    this.setState({
      isDeleteModalOpen: true,
      userToDeleteId: userId
    });
  };

  render() {
    return (
      <Users
        users={this.props.users}
        isLoading={this.props.isLoading}
        onChangePasswordClick={this.openChangePasswordForm}
        onRegisterUserClick={this.openRegisterUserForm}
        onDeleteClick={this.openDeleteConfirmationModal}
      >
        <DeleteUser
          isOpen={this.state.isDeleteModalOpen}
          onClose={() => this.setState({ isDeleteModalOpen: false })}
          userId={this.state.userToDeleteId}
        />
      </Users>
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
