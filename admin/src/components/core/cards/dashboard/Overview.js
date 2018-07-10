import React from 'react';
import PropTypes from 'prop-types';

import NumberCard from './NumberCard';
import ChartCard from './ChartCard';
import GraphCard from './GraphCard';
import ItemsCard from './ItemsCard';
import TableCard from './TableCard';

const Overview = props => {
  const { activeUsers, erasedUsers, processors } = props;

  return (
    <React.Fragment>
      <section className="cards">
        <div className="action-bar">
          <div className="text">
            <h4>{props.title}</h4>
            <p>{props.desc}</p>
          </div>
        </div>
        <div className="row">
          <NumberCard cols="2" data={activeUsers} onClick={props.onClick} />
          <NumberCard cols="2" data={erasedUsers} onClick={props.onClick} />
          <ItemsCard
            cols="4"
            title="Consented by Processor"
            data={processors}
            onClick={props.onClick}
          />
        </div>
        <div className="row">
          <GraphCard cols="3" data={{ title: 'Consented Users' }} />
          <ChartCard cols="5" data={{ title: 'Requests - Last 7 days' }} />
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
  activeUsers: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string
    })
  ),
  erasedUsers: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string
    })
  ),
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
