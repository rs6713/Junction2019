const { pool } = require("../config/config");

const getPersons = (request, response) => {
  pool.query(
    'SELECT * FROM public."Users" ORDER BY id ASC',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getPersonById = (request, response) => {
  const id = parseInt(request.params.id, 10);

  pool.query(
    'SELECT * FROM public."Users" WHERE "ID" = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const getPersonByWalletId = (request, response) => {
  pool.query(
    'SELECT * FROM public."Users" WHERE "walletid" = $1',
    [request.params.wid],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const createPerson = (request, response) => {
  const { walletid, userName, email, personType, newsletter } = request.body;

  pool.query(
    'INSERT INTO public."Users" ("walletid", "userName", "email", "personType", "newsletter") VALUES ($1, $2, $3, $4, $5)',
    [walletid, userName, email, personType, newsletter],
    (error, result) => {
      if (error) {
        throw error;
      }
      response.status(201).json(result.rows);
    }
  );
};

const updatePerson = (request, response) => {
  const { userName, email, personType, newsletter } = request.body;

  pool.query(
    'UPDATE public."Users" SET "userName" = $1, "email" = $2, "personType"=$3, "newsletter"=$4 WHERE "walletid" = $5 ',
    [userName, email, personType, newsletter, request.params.wid],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rowCount);
    }
  );
};

const deletePerson = (request, response) => {
  const id = parseInt(request.params.id, 10);

  pool.query(
    'DELETE FROM public."Users" WHERE "id" = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response
        .status(200)
        .send(`Person deleted with ID: ${results.rows[0].ProjectId}`);
    }
  );
};

module.exports = {
  getPersons,
  getPersonById,
  getPersonByWalletId,
  createPerson,
  updatePerson,
  deletePerson
};
