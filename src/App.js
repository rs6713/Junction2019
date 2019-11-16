import React, {Component} from 'react';
import Map from './containers/Map';
import MapBox from './containers/MapBox';
import Grid from './containers/Grid';
import EventBooking from './containers/EventBooking';
import Environment from './containers/Environment';
import SocialFeed from './containers/SocialFeed';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkedAlt, faCalendarAlt, faLeaf } from '@fortawesome/free-solid-svg-icons'
import Menu from './containers/Menu';
import AddEvent from './containers/AddEvent';
import EventSignUp from './containers/EventSignUp';

import Travel from './containers/Travel';

import './App.scss';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom"

class App extends Component {
  constructor(props) {
    super(props);
    this.state={

    }
    global.backendURL = "http://localhost:8000/"
    global.frontendURL = "http://localhost:3000/"
  }
  render() {
    let url = this.props;
    console.log(url)
    function styleLink(){
      return {}
    }

    return(
      <div className="App">
        <Router basename={process.env.PUBLIC_URL}>
        <div id="top">
          <Menu />
          <div id = "main">
            
              <Switch>
                <Route path="/mapbox" component={MapBox} />
                <Route path="/eventbooking" component={EventBooking} />
                <Route path="/environment" component={Environment} />
                <Route path="/addEvent" component={AddEvent} />
                <Route path="/signup/:id" component={EventSignUp} />
                <Route path="/social" component={SocialFeed} />

              </Switch>
            
          </div>

       </div>
       <div id="bottom">
          <Travel />
        </div>
        </Router>
      </div>
    )
    
  }

}

//<!--<Route path="/map" component={Map} />-->
export default App;
