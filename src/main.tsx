import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './store';
import './index.css'; // Import global styles

console.log(
  '%cThe Environment is: %c' + process.env.NODE_ENV,
  'background-color: green; color: white; font-size: 16px; font-weight: bold;',
  'background-color: black; color: lime; font-size: 16px; font-weight: bold;'
);

if (process.env.NODE_ENV === 'development') {
  console.log(
    '%c React is in Strict Mode, therefore rendering twice for each component in order to detect side effects. ',
    'background-color: green; color: white; font-size: 16px; font-weight: bold;'
  );
  console.log(
    "%cThat's why the logs are shown twice in the console!",
    'color: red; font-size: 16px; font-weight: bold;'
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
