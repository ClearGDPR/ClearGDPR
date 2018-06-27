import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import session from '../../helpers/Session';
import config from '../../config';
import internalFetch from './../../helpers/internal-fetch';

const UsersContext = createContext({
  users: [],
  fetchUsers: () => {},
  registerUser: () => {},
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
    registerUser: this.registerUser.bind(this),
    isLoading: false
  };

  async _getUsers() {
    const response = await internalFetch(`${config.API_URL}/api/management/users/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.getToken()}`
      }
    });

    return await response.json();
  }

  async _registerUser(username, password) {
    const response = await internalFetch(`${config.API_URL}/api/management/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.getToken()}`
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    if (response.status === 400) {
      this.setLoading(false);
      const result = await response.json();
      throw new Error(result.error);
    } else if (response.status !== 201) {
      this.setLoading(false);
      throw new Error('Unknown error occurred');
    }

    return await response.json();
  }

  async _deleteUser(userId) {
    const response = await fetch(`${config.API_URL}/api/management/users/${userId}/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.getToken()}`
      }
    });

    if (response.status === 404) {
      this.setLoading(false);
      const result = await response.json();
      throw new Error(result.error);
    } else if (response.status !== 200) {
      this.setLoading(false);
      throw new Error('Unknown error occurred');
    }

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

  async registerUser(username, password) {
    this.setLoading(true);

    const user = await this._registerUser(username, password);
    await this.fetchUsers();

    return user;
  }

  async deleteUser(userId) {
    this.setLoading(true);
    await this._deleteUser(userId);
    await this.fetchUsers();
  }

  render() {
    return <UsersContext.Provider value={this.state}>{this.props.children}</UsersContext.Provider>;
  }
}

export const UsersConsumer = UsersContext.Consumer;
