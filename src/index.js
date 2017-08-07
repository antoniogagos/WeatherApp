import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const WeatherApp = () => (
  <App />
);

ReactDOM.render(<WeatherApp />, document.getElementById('root'));
registerServiceWorker();
