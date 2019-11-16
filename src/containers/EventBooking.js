import React, {Component} from 'react';
import '../App.scss';
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";
import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import qrcode from 'qrcode' ;

const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    backgroundColor: lighten('#ff6c5c', 0.5),
  },
  bar: {
    borderRadius: 20,
    backgroundColor: '#ff6c5c',
  },
})(LinearProgress);



class EventBooking extends Component {
  constructor(props){
    super(props)
    this.state={
      events:[]
    }
    this.getEvents = this.getEvents.bind(this)
  }
  

  componentDidMount(){
    this.getEvents();
  }


  // total, number, description, title, location, id, 
  getEvents(){
    let self=this;
    this.setState({
      events: [{
        "description:": "Get together to play football",
        "time": (new Date()),
        "location": "Aalto Skate skeittiramppi",
        "title": "Football in the Park",
        "id": 0,
        "total":9,
        "members":["Jack Simpson", "James Jimpson", "Henz Jager", "Leo Sebastian"]
      }
      ]
    }, function() {
      async function run(i) {
        console.log(i)
        const res = await qrcode.toDataURL('localhost:3000/joinevent/'+self.state.events[i].id);
        self.setState({
          events: [...self.state.events.slice(0,i),
            {...self.state.events[i], qr:res}
          
          ,...self.state.events.slice(i+1)]
          
        }, function(){
          self.forceUpdate()
          console.log(self.state.events)
        })
        console.log('Wrote to ./qr.html', res);
      }

      for(let i=0; i<self.state.events.length;i++){
        run(i).catch(error => console.error(error.stack));
      }

    }.bind(this))

  }

  render(){
    console.log("Rendering")
    return(
      <div className ="eventbooking-container">
        
        {
          this.state.events.map(event=>
            <div className="event" >
                <div className="main">
                  <div>
                    <h3>{event.title}
                      <span>{event.members.length}/{event.total}</span>
                    </h3>
                    <p>{event.location}, <span>{event.time.toUTCString()}</span></p>
                    
                  </div>
                <img src={event.qr} />
                </div>
                <BorderLinearProgress
                  className="percentage-filled"
                  variant="determinate"
                  color="secondary"
                  value={(event.members.length/event.total)*100}
                />
              </div>

          )
        }
      </div>
    )
  }

}

export default EventBooking;