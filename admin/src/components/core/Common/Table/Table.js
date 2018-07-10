import React from 'react';
import PropTypes from 'prop-types';
import './Table.css';

const Table = ({ rows, columns, actions }) => (
  <table className="responsive-table">
    <thead>
      <tr>
        {Object.keys(columns).map(key => <th key={key}>{columns[key].title}</th>)}
        {actions.length && <th>Actions</th>}
      </tr>
    </thead>
    <tbody>
      {rows.map((item, i) => (
        <tr key={i}>
          {Object.keys(columns).map(key => <td key={key}>{item[key]}</td>)}
          {actions.length && (
            <td>
              {actions.map((action, i) => (
                <button key={i} className="ui-action btn" onClick={e => action.onClick(e, item)}>
                  {action.label}
                </button>
              ))}
            </td>
          )}
        </tr>
      ))}
    </tbody>
  </table>
);

Table.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.object.isRequired,
  actions: PropTypes.arrayOf(PropTypes.object)
};

export default Table;
