import React, { Component } from 'react';
import PlacesAutocomplete from 'react-places-autocomplete'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import Button from 'material-ui/Button';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';

class SearchPlaceDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: undefined,
      lng: undefined
    }
  }

  handleRequestClose = (lat, lng) => {
    this.setState({ 
      open: false,
      lat: lat,
      lng: lng
    });
  };

  onUserSearch = (lat, lng) => {
    this.props.onUserSearch(lat, lng);
  }

  render() {
    return (
      <div>
        <IconButton onClick={() => this.setState({ open: true })}>
          <SvgIcon style={{width: 24, height: 24}}>
            <svg fill="#fff" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
          </SvgIcon>
        </IconButton>
        <DialogUser
          open={this.state.open}
          onRequestClose={this.handleRequestClose}
          onUserSearch={this.onUserSearch}
        />
      </div>
    );
  }
}

class DialogUser extends Component {
  handleRequestClose = (lat, lng) => {
    this.props.onRequestClose(lat, lng);
  };

  onUserSearch = (lat, lng) => {
    this.props.onUserSearch(lat, lng);
  }

  handleListItemClick = value => {
    this.props.onRequestClose(value);
  };

  render() {
    const { classes, onRequestClose, selectedValue, ...other } = this.props;
    return (
      <Dialog onRequestClose={this.handleRequestClose} {...other}>
        <div>
          <SearchPlace onRequestClose={this.handleRequestClose} onUserSearch={this.onUserSearch}/>
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
      .then(latLng => {this.props.onRequestClose(latLng.lat, latLng.lng); this.props.onUserSearch(latLng.lat, latLng.lng);})
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
      <form style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', padding: 40}} onSubmit={this.handleFormSubmit}>
        <PlacesAutocomplete googleLogo={false} inputProps={inputProps} />
        <Button onClick={this._handleOnSearch} style={{marginTop: 20}} raised color="primary">Search</Button>
      </form>
    )
  }
}

export default SearchPlaceDialog;