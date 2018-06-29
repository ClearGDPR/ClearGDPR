import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import config from 'config';
import internalFetch from 'helpers/internal-fetch';

const UsersContext = createContext({
  users: [],
  fetchUsers: () => {},
  registerUser: () => {},
  deleteUser: () => {},
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
    deleteUser: this.deleteUser.bind(this),
    isLoading: false
  };

  _getUsers() {
    return internalFetch(`${config.API_URL}/api/management/users/list`);
  }

  _registerUser(username, password) {
    return internalFetch(`${config.API_URL}/api/management/users/register`, {
      method: 'POST',
      body: JSON.stringify({
        username,
        password
      })
    });
  }

  async _deleteUser(userId) {
    await internalFetch(`${config.API_URL}/api/management/users/${userId}/remove`, {
      method: 'POST'
    });
  }

  setLoading(loading) {
    this.setState({
      isLoading: loading
    });
  }

  cancelLoadingAndReject(e) {
    this.setLoading(false);
    return Promise.reject(e);
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

    const user = await this._registerUser(username, password).catch(
      this.cancelLoadingAndReject.bind(this)
    );
    await this.fetchUsers();

    return user;
  }

  async deleteUser(userId) {
    this.setLoading(true);
    await this._deleteUser(userId).catch(this.cancelLoadingAndReject.bind(this));
    await this.fetchUsers();
  }

  render() {
    return <UsersContext.Provider value={this.state}>{this.props.children}</UsersContext.Provider>;
  }
}

export const UsersConsumer = UsersContext.Consumer;
