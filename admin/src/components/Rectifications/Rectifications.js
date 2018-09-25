import React from 'react';
import PropTypes from 'prop-types';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import 'theme/Tabs.css';

import Table from 'components/core/Common/Table/Table';
import Loader from 'components/core/cards/dashboard/Loader';
import Card from 'components/core/cards/dashboard/Card';
import Paginate from 'components/core/Paginate';
import ActionBar from 'components/core/Common/Bars/ActionBar';

const actions = ({ onDetailsClick }) => [
  {
    label: 'Details',
    onClick: (e, item) => {
      e.preventDefault();
      onDetailsClick(item.id);
    }
  }
];

const columns = ({ showStatus } = { showStatus: false }) => ({
  id: {
    title: 'ID'
  },
  created_at: {
    title: 'Created at'
  },
  request_reason: {
    title: 'Reason'
  },
  status: {
    title: 'Status',
    filter: () => showStatus
  }
});

const Rectifications = ({
  isLoading,
  tabs,
  selectedTab,
  onTabSelect,
  pageCount,
  currentPage,
  onPageSelected,
  onDetailsClick,
  data
}) => {
  function handlePageClick(page) {
    onPageSelected(page);
  }

  function renderPagination() {
    return (
      <Paginate
        pageCount={pageCount}
        initialPage={currentPage - 1}
        onPageChange={({ selected }) => handlePageClick(selected + 1)}
        disableInitialCallback={true}
      />
    );
  }

  function renderPendingRequests() {
    return (
      <React.Fragment>
        <div className="content">
          {data.length > 0 ? (
            <Table rows={data} columns={columns()} actions={actions({ onDetailsClick })} />
          ) : (
            <i>No pending requests registered</i>
          )}
        </div>
        <div className="content">{renderPagination()}</div>
      </React.Fragment>
    );
  }

  function renderRequestsArchive() {
    return (
      <React.Fragment>
        <div className="content">
          {data.length > 0 ? (
            <Table
              rows={data}
              columns={columns({ showStatus: true })}
              actions={actions({ onDetailsClick })}
            />
          ) : (
            <i>No requests archieved</i>
          )}
        </div>
        <div className="content">{renderPagination()}</div>
      </React.Fragment>
    );
  }

  function renderLoader() {
    return (
      <div className="content">
        <Loader />
      </div>
    );
  }

  return (
    <section className="cards">
      <ActionBar
        title="Rectification requests"
        desc="Manage requests from users who want to execute their right to rectify the
            data stored about them."
      />
      <Tabs selectedIndex={selectedTab} onSelect={onTabSelect}>
        <TabList>{tabs.map((value, index) => <Tab key={index}>{value}</Tab>)}</TabList>
        <TabPanel>
          <div className="row">
            <Card cols={8}>{!isLoading ? renderPendingRequests() : renderLoader()}</Card>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="row">
            <Card cols={8}>{!isLoading ? renderRequestsArchive() : renderLoader()}</Card>
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
  onPageSelected: PropTypes.func.isRequired,
  onDetailsClick: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired
};

export default Rectifications;
