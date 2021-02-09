import React, { Fragment } from 'react';
import * as moment from 'moment';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea } from 'recharts';
import { useSelector } from 'react-redux';
import { IState } from '../store';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const getMetricState = (state: IState) => {
  const { metricNames } = state.weather;
  return {
    metricNames,
  };
};

const query = gql`
  query GetMultipleMeasurements($input: [MeasurementQuery]) {
    getMultipleMeasurements(input: $input) {
      metric
      measurements {
        metric
        at
        value
        unit
      }
    }
  }
`;

interface ChartProps {
  before: number;
  after: number;
}

interface ExampleObject {
  [key: string]: any;
}

export default function Chart(Props: ChartProps) {
  const { metricNames } = useSelector(getMetricState);

  var inputVariables: Array<Object> = [];
  metricNames.map((metricName: string) => {
    inputVariables.push({ metricName: metricName, after: Props.after, before: Props.before });
  });

  //query the api with dynamic variables
  var multipleMeasurements = useQuery(query, {
    variables: {
      input: inputVariables,
    },
  });

  //loop over the measurements data to create a chart array to feed the Line chart
  var chartArray: Array<Object> = [];
  multipleMeasurements &&
    multipleMeasurements.data &&
    multipleMeasurements.data.getMultipleMeasurements &&
    multipleMeasurements.data.getMultipleMeasurements.forEach((element: ExampleObject) => {
      element.measurements.forEach((measurement: ExampleObject, index: number) => {
        if (chartArray.length < element.measurements.length) {
          chartArray.push({ [`${element['metric']}`]: measurement.value, at: measurement.at });
        } else {
          Object.assign(chartArray[index], { [`${element['metric']}`]: measurement.value });
        }
      });
    });

  const initialState = {
    chartArray,
    left: 'dataMin',
    right: 'dataMax',
    refAreaLeft: '',
    refAreaRight: '',
    top: 'dataMax+1',
    bottom: 'dataMin-1',
    top2: 'dataMax+20',
    bottom2: 'dataMin-20',
    animation: true,
  };
  var tempArray = ['oilTemp', 'waterTemp', 'flareTemp'];
  var pressureArray = ['casingPressure', 'tubingPressure'];

  if (metricNames.length > 0) {
    return (
      <div className="highlight-bar-charts" style={{ userSelect: 'none' }}>
        <LineChart width={1200} height={600} data={initialState.chartArray}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="at"
            domain={['auto', 'auto']}
            type="number"
            tickFormatter={at => moment.default(at).format('HH:mm')}
          />
          {tempArray.some(temp => metricNames.includes(temp)) && (
            <YAxis
              domain={[initialState.bottom, initialState.top]}
              type="number"
              label={{ value: 'F', position: 'insideTopLeft', angle: -90, dy: 6 }}
            />
          )}
          {pressureArray.some(pressure => metricNames.includes(pressure)) && (
            <YAxis
              domain={[initialState.bottom2, initialState.top2]}
              type="number"
              yAxisId="2"
              label={{ value: 'PSI', position: 'insideTopLeft', angle: -90, dy: 14 }}
            />
          )}
          {metricNames.includes('injValveOpen') && (
            <YAxis
              domain={[initialState.bottom2, initialState.top2]}
              type="number"
              yAxisId="3"
              label={{ value: '%', position: 'insideTopLeft', angle: -90, dy: 6 }}
            />
          )}
          <Tooltip />
          {metricNames.includes('oilTemp') && (
            <Line type="natural" dataKey="oilTemp" stroke="orange" animationDuration={300} dot={false} />
          )}
          {metricNames.includes('waterTemp') && (
            <Line type="natural" dataKey="waterTemp" stroke="black" animationDuration={300} dot={false} />
          )}
          {metricNames.includes('flareTemp') && (
            <Line type="natural" dataKey="flareTemp" stroke="yellow" animationDuration={300} dot={false} />
          )}

          {metricNames.includes('casingPressure') && (
            <Line
              yAxisId="2"
              type="natural"
              dataKey="casingPressure"
              stroke="cyan"
              animationDuration={300}
              dot={false}
            />
          )}
          {metricNames.includes('tubingPressure') && (
            <Line
              yAxisId="2"
              type="natural"
              dataKey="tubingPressure"
              stroke="teal"
              animationDuration={300}
              dot={false}
            />
          )}
          {metricNames.includes('injValveOpen') && (
            <Line yAxisId="3" type="natural" dataKey="injValveOpen" stroke="red" animationDuration={300} dot={false} />
          )}

          {initialState.refAreaLeft && initialState.refAreaRight ? (
            <ReferenceArea
              yAxisId="1"
              x1={initialState.refAreaLeft}
              x2={initialState.refAreaRight}
              strokeOpacity={0.3}
            />
          ) : null}
        </LineChart>
      </div>
    );
  }
  return <Fragment />;
}
