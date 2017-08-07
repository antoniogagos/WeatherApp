import React, { Component } from 'react';
import axios from 'axios';
import UserLocationInfo from './UserLocationInfo.js'
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
    }
  }

  componentWillMount() {
    const now = new Date();
    const today = now.getDay();

    const url_forecast = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat='+this.props.latitude+'&lon='+this.props.longitude+'&appid=9004c6600242d177657696c6f37cd725&units=metric&units=metric&cnt=5'

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
      console.log(response);
      let daily_avg = [];

      for (let daily of response.data.list) {
        let index = response.data.list.indexOf(daily);
        followingDays[index].temp_min = daily.temp.min;
        followingDays[index].temp_max = daily.temp.max;

        daily.weather.forEach( weather => {
          followingDays[index].description = weather.description;
        });
      } 

      for (let day of followingDays) {
        if(day.description == 'sky is clear') {day.icon=sunnyIcon}
        else if(day.description == 'broken clouds') {day.icon=cloudsIcon}
        else if(day.description == 'light rain') {day.icon=drizzleIcon}
        else if(day.description == 'heavy intensity rain') {day.icon=heavyRainIcon}
        else if(day.description == 'moderate rain') {day.icon=lightRain}
      }
      this.setState({ nextForecastDays: followingDays});

    }.bind(this));
  }

  onClickForecast(e) {
    console.log(e.currentTarget);
  }

  render() {
    let days = this.state.nextForecastDays;
    if(!days) { return (<h1>loading</h1>)}
  
    const listDays = days.map((item) => 
      <div onClick={this.onClickForecast} key={days.indexOf(item)}>
        <div>{item.day}</div>
        <div>{Math.round(item.temp_max)}º/{Math.round(item.temp_min)}º</div>
        <img className="weatherIcon" src={item.icon} alt="weather icon"/>
      </div>);

    return (
      <div>
        <UserLocationInfo latitude={this.props.latitude} longitude={this.props.longitude} 
                          forecastDays={days}/>
         <div id="listDays">{listDays}</div>
      </div>
    )
  }
}