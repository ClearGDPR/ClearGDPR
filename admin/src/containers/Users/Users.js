import React from 'react';
import PropTypes from 'prop-types';

import Users from '../../components/Users/Users';
import config from '../../config';
// import session from '../../helpers/Session';
import { PanelConsumer } from '../MainLayout/PanelContext';
import ChangePassword from '../../containers/Users/ChangePassword';
import internalFetch from './../../helpers/internal-fetch';

export class UsersContainer extends React.Component {
  static propTypes = {
    openPanel: PropTypes.func
  };

  state = {
    users: [],
    isLoading: true
  };

  async getUsers() {
    const response = await internalFetch(`${config.API_URL}/api/management/users/list`);

    return await response.json();
  }

  componentDidMount() {
    this.getUsers()
      .then(users =>
        this.setState({
          users,
          isLoading: false
        })
      )
      .catch(e => {
        console.error(e);
        this.setState({
          isLoading: false
        });
      });
  }

  openChangePasswordForm(userId) {
    this.props.openPanel(ChangePassword, 'Change password', { userId });
  }

  render() {
    return (
      <Users
        users={this.state.users}
        isLoading={this.state.isLoading}
        onChangePasswordClick={this.openChangePasswordForm.bind(this)}
      />
    );
  }
}

export default props => (
  <PanelConsumer>
    {({ openPanel }) => <UsersContainer {...props} openPanel={openPanel} />}
  </PanelConsumer>
);
