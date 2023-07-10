import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App';
import * as serviceWorker from './serviceWorker';

const root = createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

// if (module.hot) {
//     module.hot.accept('./components/App', render);
// }

serviceWorker.unregister();
