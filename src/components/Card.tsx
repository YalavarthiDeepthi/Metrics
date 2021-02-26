import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { IState } from '../store';

const getMetricState = (state: IState) => {
  const { getNewMeasurement } = state.weather;
  return {
    getNewMeasurement,
  };
};

interface ExampleObject {
  [key: string]: any;
}

const useStyles = makeStyles({
  root: {
    minWidth: 200,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  gridContainer: {
    display: 'flex',
  },
});

const query = gql`
  query GetLastMetricValue($metricName: String!) {
    getLastKnownMeasurement(metricName: $metricName) {
      metric
      at
      value
      unit
    }
  }
`;

interface SimpleCardProps {
  metricName: string;
}

export default function SimpleCard(Props: SimpleCardProps) {
  const classes = useStyles();
  const { getNewMeasurement } = useSelector(getMetricState);

  var metricName = Props.metricName;

  //query the api with dynamic variable 'metricName' and run the query for every 1.3 seconds
  var lastMetricValue = useQuery(query, {
    variables: {
      metricName: metricName,
    },
  });

  var newMeasurementValue = Object.values(getNewMeasurement);
  var newMetricValue = newMeasurementValue.filter((x: ExampleObject) => x.metric == metricName)
  var newValue: ExampleObject = newMetricValue.length>0 ? newMetricValue[newMetricValue.length-1] : "";

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6" component="h6">
          {metricName}
        </Typography>
        <Typography variant="h3" component="h3">
          {newValue && newValue.value || lastMetricValue.data && lastMetricValue.data.getLastKnownMeasurement.value}
        </Typography>
      </CardContent>
    </Card>
  );
}
