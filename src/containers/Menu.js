import React, {Component} from 'react';
import '../App.scss';
import { BrowserRouter as Router, Route, Link, Redirect, Switch, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkedAlt, faCalendarAlt, faLeaf } from '@fortawesome/free-solid-svg-icons'

class Menu extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  componentDidMount(){

  }

  render(){
    console.log(window.location.pathname);
    //this.props.location.search;
    var self=this;
    function styleLink(url){
      console.log(self.props)
      return  self.props.history.location.pathname == url? {"background-color":"white", "color":"#222222"} : {}
    }
    return(
      <div id = "menu">
        <Link to="/mapbox">
          <div style={styleLink("/mapbox")}>
            <FontAwesomeIcon icon={faMapMarkedAlt}/>
          </div>
        </Link>
        <Link to="/eventbooking">
          <div style={styleLink("/eventbooking")}>
            <FontAwesomeIcon icon={faCalendarAlt} />
          </div>
        </Link>
        <Link to="/environment">
          <div style={styleLink("/environment")}>
            <FontAwesomeIcon icon={faLeaf} />
          </div>
        </Link>
      </div>
    )
  }

}

export default withRouter(Menu);