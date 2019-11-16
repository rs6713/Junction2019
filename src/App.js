import React, {Component} from 'react';
import Map from './containers/Map';
import MapBox from './containers/MapBox';
import Grid from './containers/Grid';

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
          <Switch>
            <Route path="/map" component={Map} />
            <Route path="/mapbox" component={MapBox} />
            <Route path="/grid" component={Grid} />
          </Switch>
        </Router>
      </div>
    )
    
  }

}


export default App;
