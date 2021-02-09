import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SimpleCard from './Card';
import { IState } from '../store';
import { useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const getMetricState = (state: IState) => {
  const { metricNames } = state.weather;
  return {
    metricNames,
  };
};

const useStyles = makeStyles({
  root: {
    minWidth: 275,
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
    padding: '10px',
  },
});

export default function Metrics() {
  const { metricNames } = useSelector(getMetricState);
  const classes = useStyles();

  //loop over the selected metrics from store and render the cards
  return (
    <div>
      <Grid container className={classes.gridContainer} spacing={2}>
        {metricNames.map((metricName: string, index: number) => (
          <Grid item xs={6} key={index}>
            <SimpleCard metricName={metricName} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
