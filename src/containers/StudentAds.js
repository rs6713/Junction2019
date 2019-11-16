import React, {Component} from 'react';
import '../App.scss';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";


class StudentAds extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  componentDidMount(){

  }

  render(){
    return(
      <div class ="studentads-container">
        Student Ads
      </div>
    )
  }

}

export default StudentAds;