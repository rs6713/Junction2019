import React, {Component} from 'react';
import Map from './containers/Map';
import MapBox from './containers/MapBox';
import Grid from './containers/Grid';
import EventBooking from './containers/EventBooking';
import Environment from './containers/Environment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkedAlt, faCalendarAlt, faLeaf } from '@fortawesome/free-solid-svg-icons'


import './App.scss';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom"

class App extends Component {
  constructor(props) {
    super(props);
    this.state={

    }
  }
  render() {
    return(
      <div class="App">
        <Router basename={process.env.PUBLIC_URL}>
        <div id = "menu">
          <Link to="mapbox">
            <div>
              <FontAwesomeIcon icon={faMapMarkedAlt}/>
            </div>
          </Link>
          <Link to="/eventbooking">
            <div>
              <FontAwesomeIcon icon={faCalendarAlt} />
            </div>
          </Link>
          <Link to="/environment">
            <div>
              <FontAwesomeIcon icon={faLeaf} />
            </div>
          </Link>
        </div>
        <div id = "main">
          
            <Switch>
              <Route path="/mapbox" component={MapBox} />
              <Route path="/eventbooking" component={EventBooking} />
              <Route path="/environment" component={Environment} />
            </Switch>
          
        </div>
        </Router>
      </div>
    )
    
  }

}

//<!--<Route path="/map" component={Map} />-->
export default App;
