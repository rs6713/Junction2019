import React, {Component} from 'react';
import '../App.scss';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";


class EventBooking extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  componentDidMount(){

  }

  render(){
    return(
      <div class ="eventbooking-container">
        Event Bookings
      </div>
    )
  }

}

export default EventBooking;