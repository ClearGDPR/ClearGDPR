import React, { Component } from 'react';
import Routes from 'routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Routes />
        <ToastContainer position="top-center" draggable />
      </div>
    );
  }
}

export default App;
