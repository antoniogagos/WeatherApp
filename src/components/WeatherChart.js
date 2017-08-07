import React, { Component } from 'react';
import axios from 'axios';
const ReactHighcharts = require('react-highcharts'); // Expects that Highcharts was loaded in the code.

export default class WeatherChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        xAxis: {
          categories: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
        },

        series: [{
          data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5]
        }]
      },

      dayTemps: undefined,
    }
  }

  componentDidMount() {
    const url_forecast = 'http://api.openweathermap.org/data/2.5/forecast?lat=' +
        this.props.latitude + '&lon=' + this.props.longitude +
        '&appid=9004c6600242d177657696c6f37cd725&units=metric&units=metric';
    axios.get(url_forecast).then(this._handleForecastResponse.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    const config = this.state.config;
    config.series[0].data = this.state.dayTemps[nextProps.selectedDay].temps;
    this.setState({
      config: config
    });
  }

  _handleForecastResponse(response) {
    const avg = [];
    const today = new Date().getDay();
    const weekDicc = {
      1: {day: "MON", temps: []},
      0: {day: "SUN", temps: []},
      2: {day: "TUE", temps: []},
      3: {day: "WED", temps: []},
      4: {day: "THU", temps: []},
      5: {day: "FRI", temps: []},
      6: {day: "SAT", temps: []}
    };
    const dayTemps = [];
    for (let i = today; i < today+5; i++) {
      if(i > 6) {
        dayTemps.push(weekDicc[i-7]);
      } else {
        dayTemps.push(weekDicc[i]);
      }
    }
    for (let item of response.data.list) {
      const weekDay = new Date(item.dt*1000).getDay();
      avg[weekDay] = avg[weekDay] || [];
      avg[weekDay].push(item);
    }
    for (let day of avg) {
      if(!day) {} else {
        const dailyTemps = [];
        day.forEach(hourly => {
          dailyTemps.push(hourly.main.temp);
        });
        if((avg.indexOf(day)-1) > 4) {} else {
          dayTemps[avg.indexOf(day)-1].temps = dailyTemps;
        }
        this.setState({
          dayTemps: dayTemps
        });
      }
    } 

  }

  render() {
    return (
      <ReactHighcharts config = {this.state.config}></ReactHighcharts>
    )
  }
}