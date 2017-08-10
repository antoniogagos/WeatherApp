import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import StarIcon from 'material-ui-icons/Star';
import MenuIcon from 'material-ui-icons/Menu';

const styleSheet = createStyleSheet({
  list: {
    width: 250,
    flex: 'initial',
  },
  listFull: {
    width: 'auto',
    flex: 'initial',
  },
});

class UndockedDrawer extends Component {
  state = {
    open: {
      left: false,
    },
  };

  toggleDrawer = (side, open) => {
    const drawerState = {};
    drawerState[side] = open;
    this.setState({ open: drawerState });
  };

  handleLeftOpen = () => this.toggleDrawer('left', true);
  handleLeftClose = () => this.toggleDrawer('left', false);

  render() {
    const classes = this.props.classes;

    const mailFolderListItems = (
      <div>
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Antonio Garcia"/>
        </ListItem>
        
       <div className="drawer_content">
        <a className="drawer_content__link"href="https://github.com/antoniogagos">Github</a>
        <span className="drawer_content__text">Weather App built with React using Highcharts and OpenWeatherMap API</span>
       </div>
      </div>
    );

    const sideList = (
      <div>
        <List className={classes.list} disablePadding>
          {mailFolderListItems}
        </List>
        <Divider />
      </div>
    );

    return (
      <div>
        <MenuIcon onClick={this.handleLeftOpen}> </MenuIcon>
        <Drawer
            open={this.state.open.left}
            onRequestClose={this.handleLeftClose}
            onClick={this.handleLeftClose}>
          {sideList}
        </Drawer>
        
      </div>
    );
  }
}

UndockedDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(UndockedDrawer);