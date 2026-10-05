import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { App } from '@components/app/app';

import { configureStore } from './utils/api/store.ts';

import './index.css';

const store = configureStore();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
