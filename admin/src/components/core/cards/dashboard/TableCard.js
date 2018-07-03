import React from 'react';
import PropTypes from 'prop-types';

import Card from './Card';

const TableCard = props => {
  return (
    <Card cols={12} title={props.title}>
      <div className="content">
        <table className="responsive-table">
          <thead>
            <tr>{props.header.map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {props.rows.map(row => <tr>{props.header.map(header => <td>{row[header]}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

TableCard.propTypes = {
  header: PropTypes.array,
  title: PropTypes.string,
  rows: PropTypes.array
};

export default TableCard;
