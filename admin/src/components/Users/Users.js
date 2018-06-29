import React from 'react';
import PropTypes from 'prop-types';

import Card from 'components/core/cards/dashboard/Card';
import Loader from 'components/core/cards/dashboard/Loader';

const Users = ({
  users,
  onChangePasswordClick,
  onRegisterUserClick,
  onDeleteClick,
  isLoading,
  children
}) => {
  function onChangePasswordClickHandler(e, userId) {
    e.preventDefault();
    onChangePasswordClick(userId);
  }

  function onDeleteClickHandler(e, userId) {
    e.preventDefault();
    onDeleteClick(userId);
  }

  function onRegisterUserClickHandler(e) {
    e.preventDefault();
    onRegisterUserClick();
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
          <button className="ui-action btn" onClick={e => onDeleteClickHandler(e, user.id)}>
            Delete
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
      {children}
    </React.Fragment>
  );
};

Users.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  onChangePasswordClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onRegisterUserClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  children: PropTypes.node
};

export default Users;
