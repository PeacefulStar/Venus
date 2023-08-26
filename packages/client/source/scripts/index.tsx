import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import App from './components/App';
import * as serviceWorker from './serviceWorker';

const root = createRoot(document.getElementById('root') as Element);

const generateUri = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://peacefulstar.art/graphql'
    : 'http://localhost:3010/graphql';
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

// if (module.hot) {
//     module.hot.accept('./components/App', render);
// }

serviceWorker.unregister();
