import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const WeatherApp = () => (
  <App />
);

ReactDOM.render(<WeatherApp />, document.getElementById('root'));
registerServiceWorker();
