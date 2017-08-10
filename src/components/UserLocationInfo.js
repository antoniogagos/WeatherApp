import React, { Component } from 'react';
import axios from 'axios';

export default class UserLocationInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      today: props.day,
      temperature: undefined,
      humidity: undefined,
      place: undefined,
      latitude: undefined,
      longitude: undefined,

      today_temp: undefined,
      today_humidity: undefined,
      search: false
    }

    this._requestLocationInfo = this._requestLocationInfo.bind(this);
  }

  componentDidMount() {
    this._requestLocationInfo();
  }

  // refactor this
  _requestLocationInfo(nextProps) {
    var url = '';
    if(arguments.length === 0) {
      url = 'http://api.openweathermap.org/data/2.5/weather?lat='+
        this.props.latitude+'&lon='+this.props.longitude+
        '&appid=9004c6600242d177657696c6f37cd725&units=metric'
    } else {
      url = 'http://api.openweathermap.org/data/2.5/weather?lat='+
        nextProps.latitude+'&lon='+nextProps.longitude+
        '&appid=9004c6600242d177657696c6f37cd725&units=metric'
    }

    axios.get(url)
    .then(function(response) {
      let data = response.data.main;
      this.setState({
        temperature: data.temp,
        today_temp: data.temp,
        humidity: data.humidity,
        today_humidity: data.humidity,
        place: response.data.name
      });
    }.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.latitude !== this.props.latitude) {
      this._requestLocationInfo(nextProps);
    }
    if(nextProps.day !== this.state.today) {
      let avg_temperature = (nextProps.day.temp_min + nextProps.day.temp_max)/2;
      this.setState({
        temperature: avg_temperature,
        humidity: nextProps.day.humidity
      }); 
    } else {
      this.setState({
        temperature: this.state.today_temp,
        humidity: this.state.today_humidity
      });
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
            <div>{Math.round(this.props.day.temp_max)}º/{Math.round(this.props.day.temp_min)}º</div>
            <span className="info__text">Temperature</span>
          </div>
          <div className="info__description">{this.props.day.description}</div>
        </div>
      </div>
    )
  }
}