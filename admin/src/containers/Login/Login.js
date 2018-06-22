import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import Login from '../../components/Login/Login';
import session from '../../helpers/Session';
import config from '../../config';

export class LoginContainer extends React.Component {
  handleLogin(username, password) {
    const { history, location } = this.props;
    const { from } = location.state || { from: { pathname: '/' } };

    return fetch(`${config.API_URL}/api/management/users/login`, {
      method: 'POST',
      body: JSON.stringify({
        username,
        password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async res => {
      session.set(await res.json());
      history.push(from);
      return res;
    });
  }

  render() {
    return <Login auth={this.handleLogin.bind(this)} />;
  }
}

LoginContainer.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
};

export default withRouter(LoginContainer);
