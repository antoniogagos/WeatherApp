import React, { Component } from 'react';
import registerServiceWorker from './registerServiceWorker';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';

import LeftDrawer from './components/Drawer.js';
import ForecastDisplay from './components/ForecastDisplay.js';
import SearchPlaceDialog from './components/SearchPlaceDialog.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 40.420031,
      longitude: -3.688831,
      search: true,
    }
    this._searchGeoloc = this._searchGeoloc.bind(this);
    this._errorGeoloc = this._errorGeoloc.bind(this);
  }
  
  componentWillMount() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._searchGeoloc, this._errorGeoloc, options);
    }
  }

  render() {
    return (
      <div className="App">
          <div>
            <div>
              <AppBar position="static">
                <Toolbar>
                  <IconButton color="contrast" aria-label="Menu">
                    <LeftDrawer />
                  </IconButton>
                  <Typography type="title" color="inherit" style={{flex: 1}}>
                    Tempo
                 </Typography>
                <SearchPlaceDialog onUserSearch={this.handleUserSearch}/>
                </Toolbar>
              </AppBar>
            </div>
            <div className="container">
              <ForecastDisplay latitude={this.state.latitude} longitude={this.state.longitude}/>
            </div>
          </div>
      </div>
    );
  }

  _handleClickDrawer = () => this.setState({open: true});

  handleUserSearch = (lat, lng) => {
    this.setState({ 
      latitude: lat,
      longitude: lng
    });
  };
  
  _searchGeoloc(position) {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }
  
  _errorGeoloc(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };
}

export default App;
