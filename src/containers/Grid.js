import React, {Component} from 'react';
import '../App.scss';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import EventBooking from "./EventBooking"
import News from './News'
import StudentAds from './StudentAds'
import Travel from './Travel'

class Grid extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  componentDidMount(){

  }

  render(){
    return(
      <div class ="grid-container">
        <EventBooking />
        <News />
        <StudentAds />
        <Travel />
      
      </div>
    )
  }

}

export default Grid;