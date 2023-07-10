import React from 'react';
import renderer from 'react-test-renderer';

import App from '../source/scripts/components/App';

test('renders correctly', () => {
    renderer.create(<App />);
});
