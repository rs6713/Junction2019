import React, {Component} from 'react';
import MapContainer from '../components/Map';
import '../App.scss';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
//AIzaSyDuyvBjBgRb95E1rryBZjP8p41hqaA3FlA

const accommodations = [
  {'name': 'Jämeräntaival 6',
  'lat': 60.188663, 'lng': 24.837004
}
]

class Map extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  componentDidMount(){

  }

  render(){
    return(
      <div class ="map-container">
        
        <MapContainer
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDuyvBjBgRb95E1rryBZjP8p41hqaA3FlA&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          markers = {accommodations}
        />
        <div>hi</div>
      </div>
    )
  }

}

export default Map;