import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { IState } from '../store';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { makeStyles } from '@material-ui/core/styles';

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

const getMetricState = (state: IState) => {
  const { metricNames } = state.weather;
  return {
    metricNames,
  };
};

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

  const { metricNames } = useSelector(getMetricState);

  var metricName = Props.metricName;

  //query the api with dynamic variable 'metricName' and run the query for every 1.3 seconds
  var lastMetricValue = useQuery(query, {
    variables: {
      metricName: metricName,
    },
    pollInterval: 1300,
  });

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6" component="h6">
          {lastMetricValue.data && lastMetricValue.data.getLastKnownMeasurement.metric}
        </Typography>
        <Typography variant="h3" component="h3">
          {lastMetricValue.data && lastMetricValue.data.getLastKnownMeasurement.value}
        </Typography>
      </CardContent>
    </Card>
  );
}
