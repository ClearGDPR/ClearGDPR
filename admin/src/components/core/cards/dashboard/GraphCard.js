import React from 'react';
import { VictoryPie, VictoryContainer, VictoryLabel } from 'victory';
import Card from './Card';

const data = [{ x: 10.349, y: 70 }, { x: 1.832, y: 30 }];

const Chart = () => {
  return (
    <VictoryPie
      colorScale={['#82efa6', '#191c27']}
      padding={{ top: 30, bottom: 0, left: 16, right: 16 }}
      height={60}
      width={100}
      data={data}
      startAngle={90}
      endAngle={-90}
      innerRadius={25}
      padAngle={3}
      containerComponent={<VictoryContainer width={100} height={50} />}
      labelComponent={<VictoryLabel style={{ fill: '#191c27', fontSize: 5 }} />}
    />
  );
};

const GraphCard = props => {
  return (
    <Card cols={props.cols} title={props.data.title} togglePanel={props.togglePanel}>
      <div className="graph-card">
        <div className="graph">
          <Chart />
        </div>
        <p className="number">89%</p>
      </div>
    </Card>
  );
};

export default GraphCard;
