import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

//create a link interface to access graphql server
const link = new HttpLink({ uri: 'https://react.eogresources.com/graphql' });

const cache = new InMemoryCache();

//create a new apollo client and export as default
const client = new ApolloClient({
  link,
  cache,
});

export default client;