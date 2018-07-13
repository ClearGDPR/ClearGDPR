import React from 'react';
import PropTypes from 'prop-types';

import { UsersConsumer } from './UsersContext';
import DeleteUser from 'components/Users/DeleteUser';

export class DeleteUserContainer extends React.Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    deleteUser: PropTypes.func.isRequired,
    onClose: PropTypes.func,
    isOpen: PropTypes.bool,
    isLoading: PropTypes.bool
  };

  deleteUser = () => {
    this.props.deleteUser(this.props.userId).then(this.props.onClose);
  };

  render() {
    return (
      <DeleteUser
        onConfirm={this.deleteUser}
        onCancel={this.props.onClose}
        isOpen={this.props.isOpen}
        isLoading={this.props.isLoading}
      />
    );
  }
}

export default props => (
  <UsersConsumer>
    {({ deleteUser, isLoading }) => (
      <DeleteUserContainer {...props} isLoading={isLoading} deleteUser={deleteUser} />
    )}
  </UsersConsumer>
);
