import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import client from './client';
import { ApolloProvider } from '@apollo/react-hooks';

const Root = () => (
  //connect the client with the app
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<Root />, document.getElementById('root'));
