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

const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    //backgroundColor: lighten('#ff6c5c', 0.5),
  },
  bar: {
    borderRadius: 20,
    //backgroundColor: '#ff6c5c',
  },
})(LinearProgress);


class EventBooking extends Component {
  constructor(props){
    super(props)
    this.state={
      title:"",
      description:"",
      location:"",
      time: new Date(),
      total:0
    }
    this.handleInputChange= this.handleInputChange.bind(this)
    this.handleSliderChange = this.handleSliderChange.bind(this)
    this.addEvent = this.addEvent.bind(this)
    
  }
  

  componentDidMount(){


  }

  addEvent(){
    // call to backend
    let data = JSON.stringify({
      title: this.state.title,
      description: this.state.description,
      location: this.state.location,
      date: this.state.time.toISOString(),
      members: "owner",
      required: this.state.total
    });
    
    fetch(global.backendURL+'events',
      {  method: "POST",
        headers: {"Content-Type": "application/json; charset=utf-8"},
        body: data})
      .then(res => {
        if(res.status === 200){
            console.log("Successful in adding event:", res)
            //resolve('success')
        }else{
          console.log("Unsuccessful in adding event:", res.message)
          //this.setState({errors: {...this.state.errors, submission: ["Unsuccessful in adding new article."]}})
          //reject(res.message)
      }
    }).catch(err=>{
      console.log("Unsuccessful in adding event:", err)
      //this.setState({errors: {...this.state.errors, submission: ["Unsuccessful in adding new article."]}})
      //reject(err)
    })
    
  }

  handleChange = date => {
    this.setState({
      time: date
    });
  };

  
  handleSliderChange(event, newValue){
    this.setState({
      total: newValue
    })
  };

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
                onChange={this.handleInputChange("title")}
              />

            </div>
            <div>
              <TextField
                id="outlined-basic"
                label="Event Description"
                margin="normal"
                variant="outlined"
                onChange={this.handleInputChange("description")}
                multiline
                rows="4"
                defaultValue="Theme, Cost..."
              />
               
            </div>
            <div>
              <h3>Date</h3>
              <DatePicker
                selected={this.state.time}
                onChange={this.handleChange}
                showTimeSelect
                dateFormat="Pp"
              />
            </div>            
            <div>
              <TextField
                id="outlined-basic"
                label="Location"
                margin="normal"
                variant="outlined"
                onChange={this.handleInputChange("location")}
                multiline
                rows="2"
                defaultValue="Street number, name, postcode"
              />
               
            </div>
            <div >
            <Typography id="discrete-slider-always" gutterBottom>
              Participants Required
            </Typography>
            <Slider
              defaultValue={1}
              aria-labelledby="discrete-slider-always"
              onChange={this.handleSliderChange}
              step={1}
              min={2}
              max={50}
              valueLabelDisplay="on"
            />
          </div>
        </form>

        

        <Button variant="contained" color="secondary" onClick={this.addEvent}>
          Add Event
        </Button>
      </div>
    )
  }

}

export default EventBooking;