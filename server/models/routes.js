const usersModel = require("./users");
const twitterModel = require("./twitter");
const trafficModel = require("./transport");
const eventsModel = require("./events");
const fetch = require("node-fetch");

//const { generateToken, sendToken } = require('./token.utils');
//const withAuth = require('../lib/secureMiddleware')

module.exports = function(app, passport) {
  //#region Routing
  app.get("/", (req, res) => {
    res.send("Welcome to Backend!! ");
  });

  app.get("/tweets", twitterModel.getTweets);
  app.get("/traffic", trafficModel.getRealtrafficTimes);
  
  
  //app.get('/users/:id', usersModel.getPersonById)
  app.get("/users/search/:wid", usersModel.getPersonByWalletId);
  app.post("/users", usersModel.createPerson);
  app.put("/users/:id", usersModel.updatePerson);
  app.delete("/users/:id", usersModel.deletePerson);

  app.get("/events", eventsModel.getEvents);
  app.get("/events/:id", eventsModel.getEventById);
  app.post("/events", eventsModel.createEvent);
  app.put("/events/:id", eventsModel.addToEvent);

  app.get("/google/:location",(request, response) => {
    console.log("Fetching location lat lng ", request.params.location, encodeURIComponent(request.params.location))
    fetch("https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDuyvBjBgRb95E1rryBZjP8p41hqaA3FlA&address="+ encodeURIComponent(request.params.location), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      console.log("What was returned: ", res.size)

      //return res.json()
      response.status(200).json(res);
    
    }).catch(err=>{
      console.log("Errored: ", err)
    })
  });



  //#endregion
};
