import React, {Component} from 'react';
import '../App.scss';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';




class EventSignUp extends Component {
  constructor(props){
    super(props)
    this.state={
      name:"",
      id: null
    }
    this.handleInputChange= this.handleInputChange.bind(this)
    this.signUp = this.signUp.bind(this)
    
  }
  

  componentDidMount(){
    
    var self = this;
    fetch(global.backendURL+"events/"+this.props.match.params.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(data =>{
        if(data){
          console.log("List of events: ", data)
          self.setState({id: data.id});
        }else{
          console.log("No data")
        }         
      }).catch(err=>{
        console.log(err)
      })

  }

  signUp(){
    // call to backend
    let data = {
      members: this.state.members+","+this.state.name
    }
    
    fetch(global.backendURL+'events/'+this.props.match.params.id,
      {  method: "PUT",
        headers: {"Content-Type": "application/json; charset=utf-8"},
        body: data})
      .then(res => {
        if(res.status === 200){
            console.log("Successful in signing up:", res)
            //resolve('success')
        }else{
          console.log("Unsuccessful in signing up:", res)
          //this.setState({errors: {...this.state.errors, submission: ["Unsuccessful in adding new article."]}})
          //reject(res.message)
      }
    }).catch(err=>{
      console.log("Unsuccessful in signing up", err)
    })
    
  }



  handleInputChange(type){
    let self = this;
    return function(event){
      self.setState({
        [type]: event.target.value
      })
    }
  };
  


  render(){
    return(
      <div className ="add-event">
        <form noValidate autoComplete="off">
            <div>
              <TextField
                id="outlined-basic"
                label="Event Name"
                margin="normal"
                variant="outlined"
                onChange={this.handleInputChange("name")}
              />

            </div>
           
        </form>

        

        <Button variant="contained" color="secondary" onClick={this.addEvent} disabled={this.state.name.length==0}>
          Sign Up
        </Button>
      </div>
    )
  }

}

export default EventSignUp;