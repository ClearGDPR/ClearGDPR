import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Login from 'components/Login/Login';
import session from 'helpers/Session';
import config from 'config';
import internalFetch from 'helpers/internal-fetch';
import { toast } from 'react-toastify';

export class LoginContainer extends React.Component {
  handleLogin = (username, password) => {
    const { history, location } = this.props;
    const { from } = location.state || { from: { pathname: '/' } };
    return internalFetch(`${config.API_URL}/api/management/users/login`, {
      method: 'POST',
      body: JSON.stringify({
        username,
        password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async resData => {
      toast.success('Logged in successfully');
      session.set({ ...resData, username });
      history.push(from);
      return resData;
    });
  };

  render() {
    // apparently this is the "official" way to use query parameters with react-router 4...
    const query = new URLSearchParams(window.location.search);
    return (
      <Login
        auth={this.handleLogin}
        errors={
          query.get('expired') ? { SessionExpired: 'Session expired, please login again' } : {}
        }
      />
    );
  }
}

LoginContainer.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(LoginContainer);
