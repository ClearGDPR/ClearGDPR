import React from 'react';
import PropTypes from 'prop-types';

import { userType } from 'types';
import Table from 'components/core/Common/Table/Table';
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

  const actions = [
    {
      label: 'Change password',
      onClick: (e, user) => {
        onChangePasswordClickHandler(e, user.id);
      }
    },
    {
      label: 'Delete',
      onClick: (e, user) => {
        onDeleteClickHandler(e, user.id);
      }
    }
  ];

  const columns = {
    id: {
      title: 'ID'
    },
    username: {
      title: 'Username'
    }
  };

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
              {!isLoading ? <Table rows={users} columns={columns} actions={actions} /> : <Loader />}
            </div>
          </Card>
        </div>
      </section>
      {children}
    </React.Fragment>
  );
};

Users.propTypes = {
  users: PropTypes.arrayOf(userType),
  onChangePasswordClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onRegisterUserClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  children: PropTypes.node
};

export default Users;
