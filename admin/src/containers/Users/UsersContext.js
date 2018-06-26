import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import session from '../../helpers/Session';
import config from '../../config';

const UsersContext = createContext({
  users: [],
  fetchUsers: () => {},
  isLoading: false
});

export class UsersProvider extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.object,
      PropTypes.arrayOf(PropTypes.element)
    ])
  };

  state = {
    users: [],
    fetchUsers: this.fetchUsers.bind(this),
    isLoading: false
  };

  async _getUsers() {
    const response = await fetch(`${config.API_URL}/api/management/users/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.getToken()}`
      }
    });

    return await response.json();
  }

  setLoading(loading) {
    this.setState({
      isLoading: loading
    });
  }

  async fetchUsers() {
    this.setLoading(true);

    let users = await this._getUsers();
    this.setState({
      users,
      isLoading: false
    });
  }

  render() {
    return <UsersContext.Provider value={this.state}>{this.props.children}</UsersContext.Provider>;
  }
}

export const UsersConsumer = UsersContext.Consumer;
