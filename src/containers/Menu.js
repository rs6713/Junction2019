import React, {Component} from 'react';
import '../App.scss';
import { BrowserRouter as Router, Route, Link, Redirect, Switch, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMapMarkedAlt, faCalendarAlt, faLeaf } from '@fortawesome/free-solid-svg-icons'
import qrcode from 'qrcode' ;
class Menu extends Component {
  constructor(props){
    super(props);
    this.state={
      qr:null
    }
  }

  componentDidMount(){
    var self = this;
    async function hi(){
      const res = await qrcode.toDataURL(global.frontendURL + 'addevent/');
      self.setState({qr:res})
    }
    hi();
  }

  render(){

    //this.props.location.search;
    var self=this;
    function styleLink(url){
      return  self.props.history.location.pathname == url? {"backgroundColor":"white", "color":"#222222"} : {}
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
        {this.state.qr &&
        <div id="add">
          <h5>Add your own event</h5>
          <img src={this.state.qr} />
        </div>
        }
      </div>
    )
  }

}

export default withRouter(Menu);