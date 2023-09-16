import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css'
import {disableReactDevTools} from '@fvilers/disable-react-devtools'

// // Replace with your Firebase config


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
