import React from 'react';
import PropTypes from 'prop-types';

import Card from '../core/cards/dashboard/Card';
import Loader from '../core/cards/dashboard/Loader';

const Users = ({ users, onChangePasswordClick, onRegisterUserClick, isLoading }) => {
  function onChangePasswordClickHandler(e, userId) {
    e.preventDefault();
    onChangePasswordClick && onChangePasswordClick(userId);
  }

  function onRegisterUserClickHandler(e) {
    e.preventDefault();
    onRegisterUserClick && onRegisterUserClick();
  }

  function renderUsers() {
    return users.map((user, idx) => (
      <tr key={idx}>
        <td data-label="ID">{user.id}</td>
        <td data-label="Username">{user.username}</td>
        <td data-label="Actions">
          <button className="ui-action btn" onClick={e => onChangePasswordClickHandler(e, user.id)}>
            Change password
          </button>
        </td>
      </tr>
    ));
  }

  return (
    <React.Fragment>
      <section className="cards">
        <div className="action-bar">
          <div className="text">
            <h4>Users</h4>
            <p>Manage users that can access the administrative panel</p>
          </div>
          <div className="spacer" />
          <button className="ui-action btn" onClick={onRegisterUserClickHandler}>
            + Register User
          </button>
        </div>
        <div className="row">
          <Card cols={8}>
            <div className="content">
              {!isLoading ? (
                <table className="responsive-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>{renderUsers()}</tbody>
                </table>
              ) : (
                <Loader />
              )}
            </div>
          </Card>
        </div>
      </section>
    </React.Fragment>
  );
};

Users.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  onChangePasswordClick: PropTypes.func,
  onRegisterUserClick: PropTypes.func,
  isLoading: PropTypes.bool
};

export default Users;
