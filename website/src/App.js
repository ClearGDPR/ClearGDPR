import React, { Component } from 'react';
import { initGA, logPageView } from './utils/analytics';
import Home from './pages/home';
import Nav from './components/nav';
import './App.css';

class App extends Component {
  componentDidMount() {
    if (process.env.NODE_ENV === 'development') {
      console.log('Development Mode, no tracking!');
    } else {
      if (!window.GA_INITIALIZED) {
        initGA();
        window.GA_INITIALIZED = true;
      }
      logPageView();
    }
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <React.Fragment>
        <Nav />
        <Home />
      </React.Fragment>
    );
  }
}

export default App;
