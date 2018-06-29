import React, { Component } from 'react';
import logo from 'assets/logo.png';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">this is app boilerplate</p>
      </div>
    );
  }
}

export default App;
