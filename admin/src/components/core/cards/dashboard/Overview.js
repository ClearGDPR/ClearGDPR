import React from 'react';
import PropTypes from 'prop-types';

import NumberCard from './NumberCard';
import ChartCard from './ChartCard';
import GraphCard from './GraphCard';
import ItemsCard from './ItemsCard';
import TableCard from './TableCard';
import ActionBar from './../../Common/Bars/ActionBar';

const Overview = props => {
  const { activeUsers, erasedUsers, processors } = props;

  return (
    <React.Fragment>
      <section className="cards">
        <ActionBar title={props.title} desc={props.desc} handleClick={props.onClick} />
        <div className="row">
          <NumberCard cols={2} data={activeUsers} onClick={props.onClick} />
          <NumberCard cols={2} data={erasedUsers} onClick={props.onClick} />
          <ItemsCard
            cols={4}
            title="Consented by Processor"
            data={processors}
            onClick={props.onClick}
          />
        </div>
        <div className="row">
          <GraphCard cols={3} data={[{ y: 10, x: 'Consented' }, { y: 21, x: 'Not Consented' }]} />
          <ChartCard cols={5} data={{ title: 'Requests - Last 7 days' }} />
        </div>
        <div className="row">
          <TableCard
            cols={8}
            title="Some Table"
            rows={[{ test1: 'value 1', test2: 'value 2', test3: 'value 3' }]}
            columns={{
              test1: { title: 'title 1' },
              test2: { title: 'title 2' },
              test3: { title: 'title 3' }
            }}
          />
        </div>
      </section>
    </React.Fragment>
  );
};

Overview.propTypes = {
  activeUsers: PropTypes.shape({
    title: PropTypes.string,
    change: PropTypes.number,
    number: PropTypes.number
  }),
  erasedUsers: PropTypes.shape({
    title: PropTypes.string,
    change: PropTypes.number,
    number: PropTypes.number
  }),
  processors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      logoUrl: PropTypes.string,
      description: PropTypes.string
    })
  ),
  title: PropTypes.string,
  desc: PropTypes.string,
  onClick: PropTypes.func
};

export default Overview;
