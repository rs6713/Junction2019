import React, {Component} from 'react';
import '../App.scss';
import Chart from '../components/chart';

import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";


class Environment extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  componentDidMount(){

  }

  render(){
    return(
      <div class ="environment-container">
        <div>
          <Chart />
        </div>
        <div>
        
        </div>
      </div>
    )
  }

}

export default Environment;