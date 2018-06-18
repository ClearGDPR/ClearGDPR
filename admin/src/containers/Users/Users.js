import React from 'react';
import Users from '../../components/Users/Users';

class UsersContainer extends React.Component {
  state = {
    users: []
  };

  async getUsers() {
    return [
      {
        id: 1,
        username: 'admin'
      },
      {
        id: 2,
        username: 'joe'
      },
      {
        id: 3,
        username: 'marc'
      },
      {
        id: 4,
        username: 'gina'
      }
    ];
  }

  componentDidMount() {
    this.getUsers().then(users =>
      this.setState({
        users
      })
    );
  }

  render() {
    return <Users users={this.state.users} />;
  }
}

export default UsersContainer;
