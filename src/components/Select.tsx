import React from 'react';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useDispatch } from 'react-redux';
import { actions } from '../Features/Metrics/reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      width: '100%',
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
      backgroundColor: 'white',
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }),
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, metricName: string[], theme: Theme) {
  return {
    fontWeight:
      metricName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

const query = gql`
  {
    getMetrics
  }
`;

export default function MultipleSelect() {
  const classes = useStyles();
  const theme = useTheme();
  const [metricName, setMetricName] = React.useState<string[]>([]);

  //query garphql getMetrics data
  const metricsData = useQuery(query);

  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMetricName(event.target.value as string[]);
  };

  React.useEffect(() => {
    //dispatch actions to store the metrics array in store
    dispatch(actions.storeMetricNames(metricName));
  }, [metricName]);

  //used material-ui multiple select component
  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select
          labelId="demo-mutiple-name-label"
          id="demo-mutiple-name"
          multiple
          value={metricName}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (
            <div className={classes.chips}>
              {(selected as string[]).map(value => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {metricsData.data &&
            metricsData.data['getMetrics'].map((name: string) => (
              <MenuItem key={name} value={name} style={getStyles(name, metricName, theme)}>
                {name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
}
