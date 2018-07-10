import React from 'react';
import PropTypes from 'prop-types';

import Card from './Card';
import Table from 'components/core/Common/Table';

const TableCard = props => {
  return (
    <Card cols={12} title={props.title}>
      <div className="content">
        <Table rows={props.rows} columns={props.header} actions={props.actions} />
      </div>
    </Card>
  );
};

TableCard.propTypes = {
  header: PropTypes.array,
  title: PropTypes.string,
  rows: PropTypes.array,
  actions: PropTypes.array
};

export default TableCard;
