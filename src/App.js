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

import './App.css';
import axios from 'axios';

class UserLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: '',
      longitude: '',
      temperature: '',
      temp_max: '',
      temp_min: '',
      humidity: '',
/*    pollution: '', */
      place: '',
      avg_min: [],
      avg_max: [],
      nextDaysForecast: {}
    }

    this._successGeoloc = this._successGeoloc.bind(this);
    this._errorGeoloc = this._errorGeoloc.bind(this);
  }

  componentDidMount() {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._successGeoloc, this._errorGeoloc, options);
    }
  }

  render() { 
    return (
      <div>
        <div id="degrees">
          <div className="degrees__number">{Math.round(this.state.temperature)} º</div>
          <div className="degrees__place">{this.state.place}</div>
        </div>
        <div id="info">
          <div>
            <div>{this.state.humidity}%</div>
            <span className="info__text">Humidity</span>
          </div>
          <div>
            <div>{Math.round(this.state.avg_min)}º/{Math.round(this.state.avg_max)}º</div>
            <span className="info__text">Temperature</span>
          </div>
        </div>
      </div>
    )
  }

  _successGeoloc(position) {
    
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    axios.get('http://api.openweathermap.org/data/2.5/weather?lat='+this.state.latitude+'&lon='+this.state.longitude+'&appid=9004c6600242d177657696c6f37cd725&units=metric')
    .then(function (response) {
      let data = response.data.main;
      this.setState({
        temperature: data.temp,
        temp_max: data.temp_max,
        temp_min: data.temp_min,
        humidity: data.humidity,
        place: response.data.name,
      });

      const url_forecast = 'http://api.openweathermap.org/data/2.5/forecast?lat='+this.state.latitude+'&lon='+this.state.longitude+'&appid=9004c6600242d177657696c6f37cd725&units=metric';
      const avg = {};
      axios.get(url_forecast).then(function(response) {
        console.log(response.data);
        for(let item of response.data.list) {
          const weekDay = new Date(item.dt*1000).getDay();
          avg[weekDay] = avg[weekDay] || [];
          avg[weekDay].push(item);
        }

        let avg_min = [];
        let avg_max = [];
        for (let i of avg[new Date().getDay()]) {
          avg_min.push(i.main.temp_min);
          avg_max.push(i.main.temp_max);
        }
        
        this.setState({
          avg_min: avg_min.reduce((a, b) => (a+b)/avg_min.length),
          avg_max: avg_max.reduce((a, b) => (a+b)/avg_max.length),
          nextDaysForecast: avg
        });
      }.bind(this));
/*       const URL = 'http://api.openweathermap.org/pollution/v1/co/'+Math.round(this.state.latitude)+','+Math.round(this.state.longitude) +'/current.json?appid=9004c6600242d177657696c6f37cd725'

      axios.get(URL).then( function(response) {
        this.setState({pollution: response.data.data[0].value});
        console.log(response);
      }.bind(this)); */
    }.bind(this));  
  }
  
  _errorGeoloc(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }
  
  _handleClickDrawer = () => this.setState({open: !this.state.open});

  render() {

    const muiTheme = getMuiTheme({
      appBar: {
        height: 50,
        color: '#fbfbfb',
      },
    });

    return (
      <div className="App">
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <AppBar
                title="Tempo"
                titleStyle={{color: '#000'}}
                iconClassNameRight="muidocs-icon-navigation-expand-more"
                iconElementLeft={<IconButton><NavigationMenu color={'#000'}/></IconButton>}
                onLeftIconButtonTouchTap={this._handleClickDrawer}
                />
                
            <UserLocation />

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
}

export default App;