import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

//create a link interface to access graphql server
const httpLink = new HttpLink({ uri: 'https://react.eogresources.com/graphql' });

const wsLink = new WebSocketLink({
  uri: `ws://react.eogresources.com/graphql`,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const cache = new InMemoryCache();

//create a new apollo client and export as default
const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
