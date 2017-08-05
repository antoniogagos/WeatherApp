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
      humidity: undefined,
      place: undefined,
    }

  }

  componentDidMount() {
    axios.get('http://api.openweathermap.org/data/2.5/weather?lat='+this.props.latitude+'&lon='+this.props.longitude+'&appid=9004c6600242d177657696c6f37cd725&units=metric')
    .then(function(response) {
      let data = response.data.main;
      this.setState({
        temperature: data.temp,
        temp_max: data.temp_max,
        temp_min: data.temp_min,
        humidity: data.humidity,
        place: response.data.name
      });

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
            <div>{Math.round(this.props.avg_max)}º/{Math.round(this.props.avg_min)}º</div>
            <span className="info__text">Temperature</span>
          </div>
        </div>
      </div>
    )
  }
}

class ForecastDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avg_min: undefined,
      avg_max: undefined,
      forecastDays: undefined,
      nextDays: undefined
    }
  }



  componentWillMount() {
    let today = new Date().getDay();

    const url_forecast = 'http://api.openweathermap.org/data/2.5/forecast?lat='
                         +this.props.latitude+'&lon='+this.props.longitude+'&appid=9004c6600242d177657696c6f37cd725&units=metric';
    const avg = [];
    axios.get(url_forecast).then(function(response) {

      for(let item of response.data.list) {
        const weekDay = new Date(item.dt*1000).getDay();
        avg[weekDay] = avg[weekDay] || [];
        avg[weekDay].push(item);
      }
      
      let avg_min = [];
      let avg_max = [];

    // If it's too late there are no avg temp for the remaining day so it should take avg temp for the following day.
      const checkAvgTemp = (a) => {
        for (let i of avg[today+a]) {
          avg_min.push(i.main.temp_min);
          avg_max.push(i.main.temp_max);
        }
      }

      if(!avg[today]) {
        checkAvgTemp(1);
      } else {
        checkAvgTemp(0);
      }

      this.setState({
        avg_min: avg_min.reduce((a, b)=>a+b/avg_min.length, 0),
        avg_max: avg_max.reduce((a, b)=>a+b/avg_max.length, 0),
        forecastDays: avg
      });

      const avg_days = {temp_min: [], temp_max: []};
      let i = 0;
      for (let day of this.state.forecastDays) {
        let totalMin = [];
        let totalMax = [];

        if(!day) {} else {
          day.forEach(item => {
            totalMin.push(item.main.temp_min);
            totalMax.push(item.main.temp_max);
          });
        }
        avg_days.temp_min.push(totalMin.reduce((a, b)=>a+b/totalMin.length, 0));
        avg_days.temp_max.push(totalMax.reduce((a, b) => a+b/totalMax.length, 0));
        i+=1
      }
      
      let days = [];
      const weekDicc = {
        0: {day: "SUN",},
        1: {day: "MON",},
        2: {day: "TUE",},
        3: {day: "WED",},
        4: {day: "THU",},
        5: {day: "FRI",}, 
        6: {day: "SAT"}
      };

      for(let i = new Date().getDay(); i < new Date().getDay()+5; i++) {
        var j = 0;
        if(i > 6) {
          days.push(weekDicc[i-7]);
          j += 1;
        } else {
          days.push(weekDicc[i]);
          j += 1;
        }
      }
      
      let y = 0;
       for (let i = today; i < today+5; i++) {
        if(i > 6) {
          days[y].temp_min = avg_days.temp_min[i-7];
          days[y].temp_max = avg_days.temp_max[i-7];
          y+=1;
        } else {
          days[y].temp_min = avg_days.temp_min[i];
          days[y].temp_max = avg_days.temp_max[i];
          y+=1;
        }
      }

      this.setState({
        nextDays: days
      });

    }.bind(this));
  }

  render() {
    if(!this.state.nextDays) { return (<h1>loading</h1>)}
    let days = this.state.nextDays;
    
    console.log(days);
    const listDays = days.map((item) => 
      <div key={this.state.nextDays.indexOf(item)}>
        <h1>{item.day}</h1>
        <p>{Math.round(item.temp_max)}º/{Math.round(item.temp_min)}º</p>
      </div>);

    return (
      <div>
        <UserLocationInfo latitude={this.props.latitude} longitude={this.props.longitude} 
                          avg_min={this.state.avg_min} avg_max={this.state.avg_max}/>
         <div id="listDays">{listDays}</div>
      </div>
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
