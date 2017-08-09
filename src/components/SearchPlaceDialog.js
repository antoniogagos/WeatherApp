import React, { Component } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete'
import { geocodeByAddress, geocodeByPlaceId, getLatLng } from 'react-places-autocomplete'
import PropTypes from 'prop-types';
import { createStyleSheet, withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import List, { ListItem, ListItemAvatar, ListItemText } from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import DialogTitle from 'material-ui/Dialog'
import Typography from 'material-ui/Typography';
import blue from 'material-ui/colors/blue';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';


class SearchPlaceDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      lat: undefined,
      lng: undefined
    }
  }

  handleRequestClose = (lat, lng) => {
    console.log(lat, lng);
    this.setState({ 
      open: false,
      lat: lat,
      lng: lng
    });
  };

  render() {
    return (
      <div>
        <Typography type="subheading">
          Selected: {this.state.lat} and {this.state.lng}
        </Typography>
        <br />
        <IconButton style={{position: 'absolute', top: 0, zIndex: 1150, right: 20, marginTop: 2}} onClick={() => this.setState({ open: true })}>
            <SvgIcon style={{width: 24, height: 24}}>
              <svg fill="#fff" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
              </svg>
            </SvgIcon>
          </IconButton>
        <DialogUser
          selectedValue={this.state.selectedValue}
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}

class DialogUser extends Component {

  handleRequestClose = (lat, lng) => {
    console.log(lat, lng);
    this.props.onRequestClose(lat, lng);
  };

  handleListItemClick = value => {
    this.props.onRequestClose(value);
  };

  render() {
    const { classes, onRequestClose, selectedValue, ...other } = this.props;
    return (
      <Dialog onRequestClose={this.handleRequestClose} {...other}>
        <div>
          <SearchPlace onRequestClose={this.handleRequestClose} />
        </div>
      </Dialog>
    );
  }
}


class SearchPlace extends Component {
 constructor(props) {
    super(props);
    this.state = {address: ''}
    this.onChange = (address) => this.setState({address})
    
  }

  _handleOnSearch = (event) => {
    event.preventDefault();
    geocodeByAddress(this.state.address).then(results =>  getLatLng(results[0]))
      .then(latLng => {this.props.onRequestClose(latLng.lat, latLng.lng); console.log('Success', latLng)})
      .catch(error => console.error('Error', error))
  }

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
      type: 'search',
      placeholder: 'Search Places...',
      autoFocus: true,
    }

    return (
      <form style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}} onSubmit={this.handleFormSubmit}>
        <PlacesAutocomplete googleLogo={false} inputProps={inputProps} />
        <Button onClick={this._handleOnSearch} style={{marginTop: 20}}raised color="primary">Search</Button>
      </form>
    )
  }
}

export default SearchPlaceDialog;