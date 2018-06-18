import React from 'react';
import Users from '../../components/Users/Users';
import config from '../../config';
import session from '../../helpers/Session';

class UsersContainer extends React.Component {
  state = {
    users: []
  };

  async getUsers() {
    const response = await fetch(`${config.API_URL}/api/management/users/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.getToken()}`
      }
    });

    return await response.json();
  }

  componentDidMount() {
    this.getUsers()
      .then(users =>
        this.setState({
          users
        })
      )
      .catch(console.error);
  }

  render() {
    return <Users users={this.state.users} />;
  }
}

export default UsersContainer;
