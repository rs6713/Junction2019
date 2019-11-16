const usersModel = require("./users");
const twitterModel = require("./twitter");
const trafficModel = require("./transport");
const eventsModel = require("./events");

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
  app.get("/event/:id", eventsModel.getEventById);
  app.post("/events", eventsModel.createEvent);
  app.put("/events/:id", eventsModel.addToEvent);



  //#endregion
};
