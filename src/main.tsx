// File: src/main.tsx
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from './store/Store';
import Spinner from './views/spinner/Spinner';
import ErrorBoundary from './components/ErrorBoundary';
import './utils/i18n';
import './_mockApis';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <Provider store={store}>
      <Suspense fallback={<Spinner />}>
        <App />
      </Suspense>
    </Provider>
  </ErrorBoundary>
);
