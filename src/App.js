import React, { Component } from 'react';
import logo from './logo.svg';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import registerServiceWorker from './registerServiceWorker';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import ForecastDisplay from './components/ForecastDisplay.js'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      latitude: undefined,
      longitude: undefined,
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
    const muiTheme = getMuiTheme({
      appBar: {
        height: 50,
        color: '#fbfbfb',
      },
    });

    if(!this.state.latitude || !this.state.longitude) {
      return (
        <div className="sk-cube-grid">
          <div className="sk-cube sk-cube1"></div>
          <div className="sk-cube sk-cube2"></div>
          <div className="sk-cube sk-cube3"></div>
          <div className="sk-cube sk-cube4"></div>
          <div className="sk-cube sk-cube5"></div>
          <div className="sk-cube sk-cube6"></div>
          <div className="sk-cube sk-cube7"></div>
          <div className="sk-cube sk-cube8"></div>
          <div className="sk-cube sk-cube9"></div>
        </div>
      )
    }

    return (
      <div className="App">
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <AppBar
                title="Tempo"
                titleStyle={{color: '#000'}}
                iconClassNameRight="muidocs-icon-navigation-expand-more"
                iconElementLeft={<IconButton><NavigationMenu color={'#000'}/></IconButton>}
                onLeftIconButtonTouchTap={this._handleClickDrawer}/>

            <ForecastDisplay latitude={this.state.latitude} longitude={this.state.longitude}/>

            <Drawer 
                open={this.state.open}
                docked={false} 
                onRequestChange={(open) => this.setState({open})}>
              <MenuItem>Menu Item</MenuItem>
              <MenuItem>Menu Item 2</MenuItem>
            </Drawer>
          </div>
        </MuiThemeProvider>

      </div>
    );
  }

  _handleClickDrawer = () => this.setState({open: !this.state.open});

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
