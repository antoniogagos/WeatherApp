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

class UserLocationInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temperature: undefined,
      temp_max: undefined,
      temp_min: undefined,
      humidity: undefined,
      place: undefined,
      avg_min: [],
      avg_max: [],
    }

  }

  componentDidMount() {
    const weekDicc = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    axios.get('http://api.openweathermap.org/data/2.5/weather?lat='
              +this.props.latitude+'&lon='+this.props.longitude+'&appid=9004c6600242d177657696c6f37cd725&units=metric')
    .then(function(response) {

      let data = response.data.main;
      this.setState({
        temperature: data.temp,
        temp_max: data.temp_max,
        temp_min: data.temp_min,
        humidity: data.humidity,
        place: response.data.name
      });

      const url_forecast = 'http://api.openweathermap.org/data/2.5/forecast?lat='
                           +this.props.latitude+'&lon='+this.props.longitude+'&appid=9004c6600242d177657696c6f37cd725&units=metric';
      const avg = {};

      axios.get(url_forecast).then(function(response) {
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
          avg_min: avg_min.reduce((a, b)=>a+b/avg_min.length, 0),
          avg_max: avg_max.reduce((a, b)=>a+b/avg_max.length, 0),
          nextDaysForecast: avg
        });
      }.bind(this));
    }.bind(this));
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
            <div>{Math.round(this.state.avg_max)}º/{Math.round(this.state.avg_min)}º</div>
            <span className="info__text">Temperature</span>
          </div>
        </div>
      </div>
    )
  }

}

class NextDaysForecast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      today: new Date().getDay(),
    }
  }

  render() {
      return (
        <h1>{this.state.today}</h1>
      )
    }
}

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

            <UserLocationInfo latitude={this.state.latitude} longitude={this.state.longitude}/>

            <NextDaysForecast />

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
    const weekDicc = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

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