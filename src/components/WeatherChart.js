import React, { Component } from 'react';
import axios from 'axios';
const ReactHighcharts = require('react-highcharts'); // Expects that Highcharts was loaded in the code.

export default class WeatherChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        xAxis: {
          categories: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
        },
        series: [{
          data: [],
        }]
      },
      categoryModify: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
      dayTemps: undefined,
    }

    this._displaySelectedDayChart = this._displaySelectedDayChart.bind(this);
    this._slicePastHoursChart = this._slicePastHoursChart.bind(this);
  }

  componentDidMount() {
    const url_forecast = 'http://api.openweathermap.org/data/2.5/forecast?lat=' +
        this.props.latitude + '&lon=' + this.props.longitude +
        '&appid=9004c6600242d177657696c6f37cd725&units=metric&units=metric';
    axios.get(url_forecast).then(this._handleForecastResponse.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    this._displaySelectedDayChart(nextProps);
  }

   _displaySelectedDayChart(nextProps) {
     const config = this.state.config;
     let selectedDayTemps = []; 
     if (this.state.dayTemps[0]) {
      if(nextProps) {
        selectedDayTemps = this.state.dayTemps[nextProps.selectedDay].temps;
        this._slicePastHoursChart(selectedDayTemps, config);
      }
      else {
        selectedDayTemps = this.state.dayTemps[this.props.selectedDay].temps;
        this._slicePastHoursChart(selectedDayTemps, config);
      }
      config.series[0].data = selectedDayTemps;
      this.setState({
        config: config
      });
     }
   } 

  _slicePastHoursChart(day, config) {
    if(day) {
      const categoryMod = this.state.categoryModify;
      if(day.length < 8) {
        config.xAxis.categories = categoryMod.slice((8-day.length)-8); 
      } else {
        config.xAxis.categories = categoryMod
      }
    }
  }

  _handleForecastResponse(response) {
    const avg = [];
    const today = new Date().getDay();
    const weekDicc = {
      0: {day: "SUN", temps: []},
      1: {day: "MON", temps: []},
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

    var arrayAvgTemps = [];
    for (let day of avg) {
      if(!day) {} else {
        const dailyTemps = [];
        day.forEach(hourly => {
          dailyTemps.push(hourly.main.temp);
        });
        arrayAvgTemps[avg.indexOf(day)] = dailyTemps;
      }
    }
    for (let item of dayTemps) {
      console.log(arrayAvgTemps);
      if(today+dayTemps.indexOf(item) > 6) {
        dayTemps[dayTemps.indexOf(item)].temps = arrayAvgTemps[today+dayTemps.indexOf(item)-7];
      } else {
        console.log(dayTemps.indexOf(item))
        dayTemps[dayTemps.indexOf(item)].temps = arrayAvgTemps[today+dayTemps.indexOf(item)];
      }
    }
      console.log(dayTemps);
    this.setState({
      dayTemps: dayTemps
    });

    this._displaySelectedDayChart();
  }

  render() {
    return (
      <ReactHighcharts config = {this.state.config}></ReactHighcharts>
    )
  }
}