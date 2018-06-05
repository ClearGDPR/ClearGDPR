import React from 'react';
import Card from './Card';
import { VictoryChart, VictoryArea, VictoryAxis } from 'victory';

const data = [
  { x: 'Sun', y: 400 },
  { x: 'Mon', y: 300 },
  { x: 'Tue', y: 200 },
  { x: 'Wed', y: 278 },
  { x: 'Thu', y: 189 },
  { x: 'Fri', y: 239 },
  { x: 'Sat', y: 349 }
];

const Chart = () => {
  return (
    <VictoryChart
      height={160}
      padding={{ top: 20, bottom: 30, left: 40, right: 16 }}
    >
      <VictoryAxis dependentAxis />
      <VictoryArea
        data={data}
        interpolation="natural"
        style={{ data: { fill: '#82efa6' } }}
      />
      <VictoryAxis />
    </VictoryChart>
  );
};

const ChartCard = props => {
  return (
    <Card
      cols={props.cols}
      title={props.data.title}
      togglePanel={props.togglePanel}
    >
      <Chart />
    </Card>
  );
};

export default ChartCard;
