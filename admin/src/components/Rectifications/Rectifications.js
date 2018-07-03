import React from 'react';
import PropTypes from 'prop-types';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Loader from 'components/core/cards/dashboard/Loader';
import Card from 'components/core/cards/dashboard/Card';

const Rectifications = ({ isLoading, tabs, selectedTab }) => {
  function renderContent() {
    return (
      <Tabs selectedIndex={selectedTab} onSelect={t => console.log(t)}>
        <TabList>{tabs.map((value, index) => <Tab key={index}>{value}</Tab>)}</TabList>

        <TabPanel>
          <h2>Any content 1</h2>
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>
        </TabPanel>
      </Tabs>
    );
  }

  return (
    <section className="cards">
      <div className="action-bar">
        <div className="text">
          <h4>Rectification requests</h4>
          <p>
            Here you can manage requests from users who want to execute their right to rectify the
            data stored about them.
          </p>
        </div>
      </div>
      <div className="row">
        <Card cols={8}>
          <div className="content">{!isLoading ? renderContent() : <Loader />}</div>
        </Card>
      </div>
    </section>
  );
};

Rectifications.propTypes = {
  isLoading: PropTypes.bool,
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.number.isRequired
};

export default Rectifications;
