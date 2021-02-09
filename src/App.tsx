import React from 'react';
import createStore from './store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Wrapper from './components/Wrapper';
import MultipleSelect from './components/Select';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const store = createStore();
const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    },
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
    select: {
      paddingRight: '10px',
      float: 'right',
      width:'70%'
    },
  }),
);

export default function App() {
  const classes = useStyles();
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <Wrapper>
          <Header />
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={6}>
            </Grid>
            <Grid item xs={6}>
              <div className={classes.select}>
                <MultipleSelect />
              </div>
            </Grid>
          </Grid>
        </Wrapper>
      </Provider>
    </MuiThemeProvider>
  );
}
