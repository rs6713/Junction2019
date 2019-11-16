const usersModel = require("./users");

//const { generateToken, sendToken } = require('./token.utils');
//const withAuth = require('../lib/secureMiddleware')

module.exports = function(app, passport) {
  //#region Routing
  app.get("/", (req, res) => {
    res.send("Welcome to Backend!! ");
  });

  app.get("/users", usersModel.getPersons);
  //app.get('/users/:id', usersModel.getPersonById)
  app.get("/users/search/:wid", usersModel.getPersonByWalletId);
  app.post("/users", usersModel.createPerson);
  app.put("/users/:id", usersModel.updatePerson);
  app.delete("/users/:id", usersModel.deletePerson);

  //#endregion
};
