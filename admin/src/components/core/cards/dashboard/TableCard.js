import React from 'react';
import PropTypes from 'prop-types';

import Card from './Card';

const TableCard = props => {
  return (
    <Card cols={props.cols} title={props.data.title} onClick={props.onClick}>
      <div className="content">
        <table className="responsive-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="ID">3112</td>
              <td data-label="Name">Cecilia Welch</td>
              <td data-label="Email">heather_keeling@gottlieb.ca</td>
              <td data-label="Phone">215-593-5846</td>
              <td data-label="Status">
                <button className="ui-action btn">Pending</button>
              </td>
            </tr>
            <tr>
              <td data-label="ID">3112</td>
              <td data-label="Name">Cecilia Welch</td>
              <td data-label="Email">heather_keeling@gottlieb.ca</td>
              <td data-label="Phone">215-593-5846</td>
              <td data-label="Status">
                <button className="ui-action btn">Pending</button>
              </td>
            </tr>
            <tr>
              <td data-label="ID">3112</td>
              <td data-label="Name">Cecilia Welch</td>
              <td data-label="Email">heather_keeling@gottlieb.ca</td>
              <td data-label="Phone">215-593-5846</td>
              <td data-label="Status">
                <button className="ui-action btn">Pending</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
};

TableCard.propTypes = {
  cols: PropTypes.number,
  data: PropTypes.shape({
    title: PropTypes.string
  }),
  onClick: PropTypes.func
};

export default TableCard;
