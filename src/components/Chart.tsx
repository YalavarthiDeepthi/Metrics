import React, { Fragment, useEffect, useState } from 'react';
import * as moment from 'moment';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceArea } from 'recharts';
import { useSelector, useDispatch } from 'react-redux';
import { IState } from '../store';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { actions } from '../Features/Weather/reducer';

const getMetricState = (state: IState) => {
  const { metricNames, getMeasurements, getNewMeasurement } = state.weather;
  return {
    metricNames,
    getMeasurements,
    getNewMeasurement,
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

const returnThirtyMinutesBefore = () => {
  return Date.now() - 30 * 60 * 1000;
};

export default function Chart(Props: ChartProps) {
  const dispatch = useDispatch();
  const [inputVariables, setInput] = useState<Array<Object>>([]);
  const { metricNames, getMeasurements, getNewMeasurement } = useSelector(getMetricState);

  useEffect(() => {
    function getDate() {
      return returnThirtyMinutesBefore();
    }
    let input: Array<Object> = [];
    metricNames.map((metricName: string) => {
      return input.push({ metricName: metricName, after: getDate() });
    });
    setInput(input);
  }, [metricNames]);

  // query the api with dynamic variables
  var multipleMeasurements = useQuery(query, {
    variables: {
      input: inputVariables,
    },
  });

  useEffect(() => {
    //dispatch actions to store the metrics array in store
    if (!multipleMeasurements) return;
    multipleMeasurements.data &&
      dispatch(actions.storeMultipleMeasurements(multipleMeasurements.data.getMultipleMeasurements));
  }, [multipleMeasurements]);

  //loop over the measurements data to create a chart array to feed the Line chart
  var chartArray: Array<Object> = [];
  getMeasurements &&
    getMeasurements.forEach((element: ExampleObject) => {
      element.measurements.forEach((measurement: ExampleObject, index: number) => {
        if (chartArray.length < element.measurements.length) {
          chartArray.push({ [`${element['metric']}`]: measurement.value, at: measurement.at });
        } else {
          Object.assign(chartArray[index], { [`${element['metric']}`]: measurement.value });
        }
      });
    });
  var newMeasurementValue = Object.values(getNewMeasurement);
  //groupby the new measurement values and add them to chartArray
  function groupArrayOfObjects(list: ExampleObject[], key: string) {
    return list.reduce(function(r, x) {
      (r[x[key]] = r[x[key]] || []).push(x);
      return r;
    }, {});
  }
  var grouped = groupArrayOfObjects(newMeasurementValue, 'at');
  Object.keys(grouped).forEach(key => {
    var newValue: ExampleObject = {};
    newValue['at'] = grouped[key][0].at;
    grouped[key].forEach((groupedValue: ExampleObject) => {
      var keyValue = groupedValue.metric;
      newValue[`${keyValue}`] = groupedValue.value;
    });
    chartArray.push(newValue);
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
