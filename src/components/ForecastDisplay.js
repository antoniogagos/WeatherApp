import React, { Component } from 'react';
import axios from 'axios';
import UserLocationInfo from './UserLocationInfo.js'
import WeatherChart from './WeatherChart.js'
import sunnyIcon from '../images/weather-clear.png';
import cloudsIcon from '../images/weather-few-clouds.png';
import drizzleIcon from '../images/weather-drizzle-day.png';
import heavyRainIcon from '../images/weather-showers-night.png'
import lightRain from '../images/weather-showers-scattered-day.png'

export default class ForecastDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextForecastDays: undefined,
      selectedDay: undefined,
      selectedForecast: undefined,
      addClassIndex: 0
    }
    this._onClickForecastDay = this._onClickForecastDay.bind(this);
    this._onChangeLocationDisplay = this._onChangeLocationDisplay.bind(this);
  }

  componentDidMount() {
    this._onChangeLocationDisplay();
  }

  componentWillReceiveProps(nextProps) {
    this._onChangeLocationDisplay(nextProps);
  }

  // When user searches location
  _onChangeLocationDisplay(nextProps) {
    const now = new Date();
    const today = now.getDay();
    var url_forecast = '';

    if(arguments.length === 0) {
      url_forecast = 'https://api.openweathermap.org/data/2.5/forecast/daily?lat='+
          this.props.latitude+'&lon='+this.props.longitude+
          '&appid=9004c6600242d177657696c6f37cd725&units=metric&units=metric&cnt=5'
    } else {
      url_forecast = 'https://api.openweathermap.org/data/2.5/forecast/daily?lat='+
          nextProps.latitude+'&lon='+nextProps.longitude+
          '&appid=9004c6600242d177657696c6f37cd725&units=metric&units=metric&cnt=5'}

    const weekDicc = {
      0: {day: "SUN"},
      1: {day: "MON"},
      2: {day: "TUE"},
      3: {day: "WED"},
      4: {day: "THU"},
      5: {day: "FRI"},
      6: {day: "SAT"}
    };

    let followingDays = [];
    for(let i = today; i < today+5; i++) {
      if(i > 6) {
        followingDays.push(weekDicc[i-7]);
      } else {
        followingDays.push(weekDicc[i]);
      }
    }

    axios.get(url_forecast).then(function(response) {
      for (let daily of response.data.list) {
        let index = response.data.list.indexOf(daily);
        followingDays[index].temp_min = daily.temp.min;
        followingDays[index].temp_max = daily.temp.max;
        followingDays[index].humidity = daily.humidity
        daily.weather.forEach( weather => {
          followingDays[index].description = weather.description;
        });
      } 

      for (let day of followingDays) {
        switch(day.description) {
          case 'sky is clear':
            day.icon = sunnyIcon;
            break;
          case 'light rain':
            day.icon = drizzleIcon;
            break;
          case 'heavy intensity rain':
            day.icon = heavyRainIcon;
            break;
          case 'moderate rain':
            day.icon = lightRain;
            break;
          case 'very heavy rain':
            day.icon = heavyRainIcon;
            break;
          case 'scattered clouds':
          case 'overcast clouds':
          case 'few clouds':
          case 'broken clouds':
            day.icon = cloudsIcon;
            break;
        }
      }
      this.setState({ 
        nextForecastDays: followingDays,
        selectedDay: followingDays[0]
      });
    }.bind(this));
  }

  _onClickForecastDay(e) {
    
    let key_item;
    if(!e._targetInst._currentElement.key) {
      key_item = e._targetInst._hostParent._currentElement.key;
    } else {
      key_item = e._targetInst._currentElement.key
    }
    this.setState({
      selectedDay: this.state.nextForecastDays[key_item],
      addClassIndex: key_item
    });
  }

  render() {
    let allDays = this.state.nextForecastDays;
    if(!allDays) { return (<h1>loading</h1>)}
    let addClassDay = item => {
      if(this.state.addClassIndex == allDays.indexOf(item)) {
        return 'day day__selected'
      } else {
        return 'day'
      }
    }
    const dailyForecast = allDays.map((item) => 
      <div key={allDays.indexOf(item)} onClick={this._onClickForecastDay} className={addClassDay(item)}>
        <div>{item.day}</div>
        <div className="day__avgTemp">{Math.round(item.temp_max)}º/{Math.round(item.temp_min)}º</div>
        <img className="day__icon" src={item.icon} alt="weather icon"/>
      </div>);
    return (
      <div>
        <UserLocationInfo latitude={this.props.latitude} longitude={this.props.longitude} 
                          day={this.state.selectedDay}/>
                          
        <WeatherChart latitude={this.props.latitude} longitude={this.props.longitude} selectedDay={this.state.addClassIndex}/>
         <div id="listDays">{dailyForecast}</div>
      </div>
    )
  }
}
