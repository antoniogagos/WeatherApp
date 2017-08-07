import React, { Component } from 'react';
import axios from 'axios';

export default class UserLocationInfo extends Component {
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
        humidity: data.humidity,
        place: response.data.name
      });
    }.bind(this));
  }

  render() {
    console.log(this.props);
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
            <div>{Math.round(this.props.forecastDays[0].temp_max)}º/{Math.round(this.props.forecastDays[0].temp_min)}º</div>
            <span className="info__text">Temperature</span>
          </div>
        </div>
      </div>
    )
  }
}