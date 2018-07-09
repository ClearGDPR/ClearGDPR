import React, { Component } from 'react';
import SubjectsList from './Widgets/SubjectsList';
import ConsentDial from './Widgets/ConsentDial';

class Dashboard extends Component {
  render() {
    return (
      <section className="cards">
        <div className="row">
          <SubjectsList />
        </div>
        <div className="row">
          <ConsentDial />
        </div>
      </section>
    );
  }
}

export default Dashboard;
