import React, {Component} from 'react';
import '../App.scss';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBiking, faTrain } from '@fortawesome/free-solid-svg-icons'
import { request } from 'http';

class Travel extends Component {
  constructor(props){
    super(props)
    this.state={
      bike: {occupancy: 8, total: 20},
      train: [{name: "SMI", destination:"Matinkyla - Vusaari" , when:8 }, {name: "F2" , destination:"Matinkyla - Vusaari", when:4 }]
    }
  }

  componentDidMount(){
    var self=this;
    

    fetch(global.backendURL + "traffic", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data =>{
        self.setState(data);         
      })
      .catch(err => console.log(err))

  }

  render(){
    return(
      <div class ="travel-container">
        <div class="bike">
          <span><FontAwesomeIcon icon={faBiking}/></span> 
          <span><h3>{this.state.bike.occupancy} / {this.state.bike.total}</h3></span>
        </div>
        {this.state.train.map(t=>
          <div class="train">
            <span><FontAwesomeIcon icon={faTrain}/></span> 
            <span>
              <h3>
                <b>{t.name}</b> {t.destination} {t.when} mins
              </h3>
            </span>

          </div> 
        )}

      </div>
    )
  }

}

// <p>{t.when.slice(1,Math.min(3, t.when.length) ).join(', ')}...</p>

export default Travel;