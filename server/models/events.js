const { pool } = require("../config/config");

const createEvent = (request, response) => {
  const { title, description, location, date, required, members } = request.body;
  console.log("Asked to create event:", request.body)
  pool.query(
    'INSERT INTO public."events" ("title", "description", "location", "creationDate", "required", "members") VALUES ($1, $2, $3, $4, $5, $6)',
    [title, description, location, date, required, members],
    (error, result) => {
      if (error) {
        console.log("Errored", error)
        throw error;
      }
      console.log("Successful insert", result)
      response.status(201).json(result.rows);
    }
  );
};

const getEvents = (request, response) => {
  console.log("Asked to get events\n")
  pool.query(
    'SELECT * FROM public."events"',
    (error, results) => {
      if (error) {
        console.log("Errored: ", error)
        throw error;
      }
      console.log("Fetched the following events: ",results)
      response.status(200).json(results.rows);
    }
  );
};

const getEventById = (request, response) => {
  const id = parseInt(request.params.id, 10);
  console.log("Fetching event id: ", id)
  pool.query(
    'SELECT * FROM public."events" WHERE "id" = $1',
    [id],
    (error, results) => {
      if (error) {
        console.log(error)
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const addToEvent = (request, response) => {
  const { members} = request.body;
  const id = parseInt(request.params.id, 10);
  console.log("Adding to event: ", id, members)
  pool.query(
    'UPDATE public."events" SET "members" = $1 WHERE "id" = $2',
    [members, id],
    (error, results) => {
      if (error) {
        console.log(error)
        throw error;
      }
      response.status(200).json(results.rowCount);
    }
  );
};

module.exports = {
  getEvents,
  createEvent,
  addToEvent,
  getEventById
};

