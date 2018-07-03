import React from 'react';
import PropTypes from 'prop-types';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'theme/Tabs.css';

import Loader from 'components/core/cards/dashboard/Loader';
import Card from 'components/core/cards/dashboard/Card';

const Rectifications = ({
  isLoading,
  tabs,
  selectedTab,
  onTabSelect,
  pageCount,
  currentPage,
  data
}) => {
  function renderTableHeading(showStatus = false) {
    return (
      <thead>
        <tr>
          <th>ID</th>
          <th>Created at</th>
          <th>Reason</th>
          {showStatus && <th>Status</th>}
          <th>Actions</th>
        </tr>
      </thead>
    );
  }

  function renderTableBody(showStatus = false) {
    return (
      <tbody>
        {data.map((value, index) => (
          <tr key={index}>
            <td>{value.id}</td>
            <td>{value.created_at}</td>
            <td>{value.request_reason}</td>
            {showStatus && <td>{value.status}</td>}
            <td>
              <button className="ui-action btn" onClick={e => {}}>
                Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  function renderPendingRequests() {
    return (
      <table className="responsive-table">
        {renderTableHeading()}
        {renderTableBody()}
      </table>
    );
  }

  function renderRequestsArchive() {
    return (
      <table className="responsive-table">
        {renderTableHeading(true)}
        {renderTableBody(true)}
      </table>
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
      <Tabs selectedIndex={selectedTab} onSelect={onTabSelect}>
        <TabList>{tabs.map((value, index) => <Tab key={index}>{value}</Tab>)}</TabList>
        <TabPanel>
          <div className="row">
            <Card cols={8}>
              <div className="content">{!isLoading ? renderPendingRequests() : <Loader />}</div>
            </Card>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="row">
            <Card cols={8}>
              <div className="content">{!isLoading ? renderRequestsArchive() : <Loader />}</div>
            </Card>
          </div>
        </TabPanel>
      </Tabs>
    </section>
  );
};

Rectifications.propTypes = {
  isLoading: PropTypes.bool,
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.number.isRequired,
  onTabSelect: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired
};

export default Rectifications;
