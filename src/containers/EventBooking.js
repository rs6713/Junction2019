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
      events:[],
      studentevents:[]
    }
    this.getEvents = this.getEvents.bind(this)
    this.getStudentEvents = this.getStudentEvents.bind(this);
  }
  

  componentDidMount(){
    this.getEvents();
    this.getStudentEvents();
  }

  getStudentEvents(){
    this.setState({
      studentevents:[
        {
          organisation: "ESN Uni Helsinki",
          title:"goes to Pirates of the Baltic Sea",
          img: "https://i.ytimg.com/vi/fspSTg8Gumo/maxresdefault.jpg",
          info: ["What? Pirates of the Baltic Sea", "Where? Stockholm, Sweden", "When? 17 Nov - 19 Nov", "How much? 23 euros", "Why? Best tru Finnish Party Travelling"]
        },
        {
          organisation: "ESN Uni Helsinki",
          title:"Christmas Sauna Party",
          img: "http://syote.fi/app/uploads/2016/11/JormaJ-msen-Ahmatupa-sauna_kaikkioikeudet-600x400.jpg",
          info: ["What? Christmas Sauna Party", "Where? Leppasuonkatu 11", "When? 1 Dec 11:00 - 15:30", "How much? 6 euros", "Why? Tons of fun awaits you"]
        }
      ]
    })
  }

  // total, number, description, title, location, id, 
  getEvents(){
    let self=this;
    console.log("Fetching events")

    fetch(global.backendURL+"events/", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      console.log("What was returned: ", res)
      return res.json()
    
    })
      .then(data =>{
        if(data){
          console.log("List of events: ", data)
          self.setState({events: data.map(d=>(
            {
              description: d.description,
              title: d.title,
              members: d.members.split(','),
              location: d.location,
              id: d.id,
              total: d.required,
              time: new Date(d.creationDate)
            }
          ))});
        }else{
          console.log("No data, filling dummy")

          self.setState({
            events: [{
              "description:": "Get together to play football",
              "time": (new Date()),
              "location": "Aalto Skate skeittiramppi",
              "title": "Football in the Park",
              "id": 0,
              "total":9,
              "members":["Jack Simpson", "James Jimpson", "Henz Jager", "Leo Sebastian"]
            },
            {
              "description:": "Yoga Tuesday",
              "time": (new Date()),
              "location": "Alvarinaukio",
              "title": "Yoga in the Park",
              "id": 1,
              "total":null,
              "members":["Jack Simpson", "James Jimpson", "Henz Jager", "Leo Sebastian"]
              }
            ]
          });
        }
        // Now can generate qrs.
        // Either filled with dummy or fetched from database

        async function run(i) {
          console.log(i)
          const res = await qrcode.toDataURL(global.frontendURL + 'signup/'+self.state.events[i].id);
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

      }).catch(err=>{
        console.log("Error when fetching events: ",err)
        console.log("Filling dummy")
        self.setState({
          events: [{
            "description:": "Get together to play football",
            "time": (new Date()),
            "location": "Aalto Skate skeittiramppi",
            "title": "Football in the Park",
            "id": 0,
            "total":9,
            "members":["Jack Simpson", "James Jimpson", "Henz Jager", "Leo Sebastian"]
          },
          {
            "description:": "Yoga Tuesday",
            "time": (new Date()),
            "location": "Alvarinaukio",
            "title": "Yoga in the Park",
            "id": 1,
            "total":null,
            "members":["Jack Simpson", "James Jimpson", "Henz Jager", "Leo Sebastian"]
            }
          ]
        });
        async function run(i) {
          console.log(i)
          const res = await qrcode.toDataURL(global.frontendURL +'signup/'+self.state.events[i].id);
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


      })
    }


  render(){
    console.log("Rendering")
    return(
      <div className ="events">
        <div className = "studentevents">
          {this.state.studentevents.map(se=>
            <div>
              <h3><span>{se.organisation}</span><br/>
              <b>{se.title}</b></h3>
              <div>
                <div>
                  <img src={se.img}/>
                </div>
                <div>
                  {se.info.map(i=>
                    <p>{i}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        
        </div>
        
        <div className="eventbooking-container">
        <h2>Activity Signup</h2>
        {
          this.state.events.map(event=>
            <div className="event" >
                <div className="main">
                  <div>
                    <h3>{event.title}
                      <span>{event.members.length} {event.total? "/"+event.total: ""}</span>
                    </h3>
                    <p>{event.location}, <span>{event.time.toUTCString()}</span></p>
                    
                  </div>
                <img src={event.qr} />
                </div>
                <BorderLinearProgress
                  className="percentage-filled"
                  variant="determinate"
                  color={event.total && event.total>event.members.length ? "secondary":"primary" }
                  value={event.total?(event.members.length/event.total)*100: 100}
                />
              </div>

          )
        }
        </div>
      </div>
    )
  }

}

export default EventBooking;