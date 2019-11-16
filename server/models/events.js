const { pool } = require("../config/config");

const createEvent = (request, response) => {
  const { title, description, location, date, required, members } = request.body;

  pool.query(
    'INSERT INTO public."Events" ("title", "description", "location", "date", "required", "members") VALUES ($1, $2, $3, $4, $5, $6)',
    [title, description, location, date, required, members],
    (error, result) => {
      if (error) {
        console.log(error)
        throw error;
      }
      response.status(201).json(result.rows);
    }
  );
};

const getEvents = (request, response) => {
  console.log("Asked to get events")
  pool.query(
    'SELECT * FROM public."Events" ORDER BY date ASC',
    (error, results) => {
      if (error) {
        console.log(error)
        throw error;
      }
      console.log("Fetched the following events: ",results, results.rows)
      response.status(200).json(results.rows);
    }
  );
};

const getEventById = (request, response) => {
  const id = parseInt(request.params.id, 10);

  pool.query(
    'SELECT * FROM public."Events" WHERE "ID" = $1',
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
  pool.query(
    'UPDATE public."Events" SET "members" = $1 WHERE 2id" = $5 ',
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

