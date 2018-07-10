import React from 'react';
import PropTypes from 'prop-types';
import './Table.css';

const Table = ({ items, columns }) => (
  <table className="responsive-table">
    <thead>
      <tr>{Object.keys(columns).map(key => <th key={key}>{columns[key].title}</th>)}</tr>
    </thead>
    <tbody>
      {items.map((item, i) => (
        <tr key={i}>{Object.keys(columns).map(key => <td key={key}>{item[key]}</td>)}</tr>
      ))}
    </tbody>
  </table>
);

Table.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.object.isRequired
};

export default Table;
