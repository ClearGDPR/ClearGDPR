import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './components/core/pages/Login';
import Dashboard from './components/core/pages/Dashboard';
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <Route exact path="/" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
        </React.Fragment>
      </Router>
    );
  }
}

export default App;
