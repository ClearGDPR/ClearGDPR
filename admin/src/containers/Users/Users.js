import React from 'react';
import Users from '../../components/Users/Users';
import config from '../../config';
import session from '../../helpers/Session';

class UsersContainer extends React.Component {
  state = {
    users: [],
    isLoading: true
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

  render() {
    return <Users users={this.state.users} isLoading={this.state.isLoading} />;
  }
}

export default UsersContainer;
