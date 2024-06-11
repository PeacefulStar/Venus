import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';

import App from './components/App';

const root = createRoot(document.getElementById('root') as Element);
const { NODE_ENV, TYPE } = process.env;
console.log(NODE_ENV)

const generateUri = (): string => {
  return NODE_ENV === 'production'
    ? 'https://peacefulstar.art/graphql' :
    TYPE === 'virtual' ?
      'http://localhost:3010/graphql':
      'http://localhost:3000/graphql';
};

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: generateUri(),
  credentials: 'include',
});

root.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
);
