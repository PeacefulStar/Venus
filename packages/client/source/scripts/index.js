import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import App from './components/App';
import * as serviceWorker from './serviceWorker';

const root = createRoot(document.getElementById('root'));
const generateUri = () => {
  console.log(process.env.NODE_ENV)
  return process.env.NODE_ENV === 'production'
    ? 'https://peacefulstar.art'
    : 'http://localhost:3000/';
};

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: generateUri(),
  credentials: 'include',
});

root.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </ApolloProvider>
);

// if (module.hot) {
//     module.hot.accept('./components/App', render);
// }

serviceWorker.unregister();
