import React from 'react';
import { VictoryPie } from 'victory';
import Card from './Card';

const data = [{ x: 10.349, y: 70 }, { x: 1.832, y: 30 }];

const Chart = () => {
  return (
    <VictoryPie
      colorScale={['#82efa6', '#191c27']}
      padding={{ top: 30, bottom: 0, left: 16, right: 16 }}
      height={180}
      width={200}
      data={data}
      startAngle={90}
      endAngle={-90}
      innerRadius={40}
      padAngle={3}
    />
  );
};

const GraphCard = props => {
  return (
    <Card
      cols={props.cols}
      title={props.data.title}
      togglePanel={props.togglePanel}
    >
      <Chart />
      <p className="graph-card number">89%</p>
    </Card>
  );
};

export default GraphCard;
