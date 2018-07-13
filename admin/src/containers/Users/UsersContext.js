import React, { Component, createContext } from 'react';
import PropTypes from 'prop-types';
import config from 'config';
import internalFetch from 'helpers/internal-fetch';
import { toast } from 'react-toastify';

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
    fetchUsers: this.fetchUsers,
    registerUser: this.registerUser,
    deleteUser: this.deleteUser,
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

  cancelLoadingAndReject = e => {
    this.setLoading(false);
    return Promise.reject(e);
  };

  fetchUsers = async () => {
    this.setLoading(true);

    let users = await this._getUsers();
    this.setState({
      users,
      isLoading: false
    });
  };

  registerUser = async (username, password) => {
    this.setLoading(true);

    const user = await this._registerUser(username, password).catch(this.cancelLoadingAndReject);
    toast.success('User successfully registered');
    await this.fetchUsers();

    return user;
  };

  deleteUser = async userId => {
    this.setLoading(true);
    await this._deleteUser(userId).catch(this.cancelLoadingAndReject);
    toast.success('User successfully deleted');
    await this.fetchUsers();
  };

  render() {
    return <UsersContext.Provider value={this.state}>{this.props.children}</UsersContext.Provider>;
  }
}

export const UsersConsumer = UsersContext.Consumer;
