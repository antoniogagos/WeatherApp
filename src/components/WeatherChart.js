import React, { Component } from 'react';
import axios from 'axios';
const ReactHighcharts = require('react-highcharts');

export default class WeatherChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: {
        xAxis: {
          className: 'highcharts-x-axis',
          categories: ['00', '03', '06', '09', '12', '15', '18', '21'],
          title: {
            enabled: false,
            text: 'hours',
          },
        },
        yAxis: {
          className: 'highcharts-y-axis',
          title: {
            text: '°C'
          },
          gridLineColor: '#eee'
        },

        tooltip: {
          backgroundColor: '#3f51b5',
          useHTML: true,
          shared: true,
          headerFormat: null,
          pointFormat: '<span style="font-size: 12px; margin-bottom: 10px; color: #fbfbfb;">Temperature:</span><br> <span style=" color: #FAFAFA; font-size: 16px">{point.y}ºC</span>',
          style: {
            color: 'white',
          }
        },
        chart: {
          animation: false,
          marginRight: 40,
          style: {
            fontFamily: 'Roboto',
          },
          plotBackgroundColor: '#FFFFFF',
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          column: {
            borderRadius: 5
          },
          series: {
            animation: {
              duration: 1000,
            },
            marker: {
              lineWidth: 2,
              lineColor: null
            },
          }
        },
        series: [{
          data: [],
          color: '#3f51b5',
        }],
        title: null,
      },
      categoryModify: ['00', '03', '06', '09', '12', '15', '18', '21'],
      dayTemps: undefined,
    }
    this._displaySelectedDayChart = this._displaySelectedDayChart.bind(this);
    this._slicePastHoursChart = this._slicePastHoursChart.bind(this);
  }

  componentDidMount() {
    const url_forecast = 'https://api.openweathermap.org/data/2.5/forecast?lat=' +
        this.props.latitude + '&lon=' + this.props.longitude +
        '&appid=9004c6600242d177657696c6f37cd725&units=metric&units=metric';
    axios.get(url_forecast).then(this._handleForecastResponse.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.latitude !== this.props.latitude) {
      const url_forecast = 'https://api.openweathermap.org/data/2.5/forecast?lat=' +
          nextProps.latitude + '&lon=' + nextProps.longitude +
          '&appid=9004c6600242d177657696c6f37cd725&units=metric&units=metric';
      axios.get(url_forecast).then(this._handleForecastResponse.bind(this));
    }
    this._displaySelectedDayChart(nextProps);
  }

   _displaySelectedDayChart(nextProps) {
     const config = this.state.config;
     let selectedDayTemps = []; 
     if (this.state.dayTemps[0]) {
      if  (nextProps) {
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
      if(today+dayTemps.indexOf(item) > 6) {
        dayTemps[dayTemps.indexOf(item)].temps = arrayAvgTemps[today+dayTemps.indexOf(item)-7];
      } else {
        dayTemps[dayTemps.indexOf(item)].temps = arrayAvgTemps[today+dayTemps.indexOf(item)];
      }
    }
    this.setState({
      dayTemps: dayTemps
    });

    this._displaySelectedDayChart();
  }

  render() {
    return (
      <ReactHighcharts config={this.state.config} domProps={{id:'weatherChart'}}></ReactHighcharts>
    )
  }
}