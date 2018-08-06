import React from 'react';
import PropTypes from 'prop-types';

import Card from './Card';
import Table from 'components/core/Common/Table/Table';

const TableCard = props => {
  return (
    <Card cols={props.cols} title={props.title}>
      <div className="content">
        <Table rows={props.rows} columns={props.columns} actions={props.actions} />
      </div>
    </Card>
  );
};

TableCard.propTypes = {
  cols: PropTypes.number,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  rows: PropTypes.array.isRequired,
  columns: PropTypes.object.isRequired,
  actions: PropTypes.array
};

TableCard.defaultProps = {
  cols: 12
};

export default TableCard;
